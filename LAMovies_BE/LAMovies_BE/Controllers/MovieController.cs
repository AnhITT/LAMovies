﻿using Libs.Dtos;
using Libs.Models;
using Libs.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PayPal.Api;
using System.Security.Policy;
using System.Text.Json.Serialization;
using System.Text.Json;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;

namespace LAMovies_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly IMovieRepository _movieRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly IActorRepository _actorRepository;
        private readonly IGenreRepository _genreRepository;
        private readonly IPricingRepository _pricingRepository;


        public MovieController(IMovieRepository movieRepository, IAccountRepository accountRepository,
           IActorRepository actorRepository, IGenreRepository genreRepository, IPricingRepository pricingRepository)
        {
            _movieRepository = movieRepository;
            _accountRepository = accountRepository;
            _actorRepository = actorRepository;
             _genreRepository = genreRepository;
            _pricingRepository = pricingRepository;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Movie>> Get()
        {
            return _movieRepository.getAll();
        }
        [HttpGet]
        [Route("GetTop6MovieView")]
        public ActionResult<IEnumerable<Movie>> GetTop6MovieView()
        {
            try
            {
                var movie = _movieRepository.GetTop6MovieView();
                return Ok(movie);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpGet]
        [Route("ThongKe")]
        public ActionResult<ThongKeDTO> ThongKe()
        {
            try
            {
                var data = new ThongKeDTO();
                data.countMovies = _movieRepository.CountMovie();
                data.countAccount = _accountRepository.CountAccount();
                data.countActor = _actorRepository.CountActor();
                data.countGenre = _genreRepository.CountGenre();
                data.countMoviesSeries = _movieRepository.CountMovieSeries();
                data.countMoviesOdd = _movieRepository.CountMovieOdd();
                data.top1Movie = _movieRepository.Top1Movie();
                data.countAccountUseService = _pricingRepository.CountUserPricing();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
        // GET: api/Movie/5
        [HttpGet]
        [Route("GetMovieById")]
        public ActionResult<Movie> GetMovieById(int id)
        {
            try
            {
                var movie = _movieRepository.GetById(id);
                return Ok(movie);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpGet]
        [Route("GetURLOddMovie")]
        public ActionResult<Movie> GetURLOddMovie(int id)
        {
            try
            {
                var movie = _movieRepository.GetURLOddMovie(id);
                return Ok(movie);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpGet]
        [Route("GetURLSeriesMovies")]
        public ActionResult<Movie> GetURLSeriesMovies(int id, int tap)
        {
            try
            {
                var movies = _movieRepository.GetURLSeriesMovies(id);
                if (movies.Count != 0)
                {
                    SeriesMoviesDTO series = new SeriesMoviesDTO();
                    var movieLink = movies.FirstOrDefault(m => m.Practice == tap);
                    series.ID = id;
                    series.Url = movieLink.Url;
                    series.Tap = movieLink.Practice;
                    series.TotalTap = _movieRepository.GetById(id).Episodes;
                    return Ok(series);
                }
                return NotFound("");
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpPost]
        [Route("CreateMovie")]
        public ActionResult CreateMovie([FromBody] Movie movie)
        {
            try
            {
                _movieRepository.Insert(movie);
                return Ok("Create Movie Success");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Route("AddLinkURL")]
        public ActionResult AddLinkURL([FromBody] OddMovie movie)
        {
            try
            {
                var url = UploadFileToGoogleDrive(movie);
                movie.Url = url;
                _movieRepository.AddURLOddMovie(movie);
                _movieRepository.Save();
                return Ok(movie);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        private string GetEmbedCode(string fileId)
        {
            return $"https://drive.google.com/file/d/{fileId}/preview";
        }

        private string UploadFileToGoogleDrive(OddMovie movie)
        {
            string appDirectory = AppDomain.CurrentDomain.BaseDirectory;

            // Đường dẫn tới tệp credentials.json
            string credentialsPath = Path.Combine(appDirectory, "Helper", "credentials.json");

            // Đường dẫn đến thư mục "helper"
            string _helperDirectory = Path.Combine(appDirectory, "Helper", "token.json");

            GoogleCredential credential;
            using (var stream = new FileStream(credentialsPath, FileMode.Open, FileAccess.Read))
            {
                credential = GoogleCredential.FromStream(stream)
                    .CreateScoped(DriveService.ScopeConstants.Drive);
            }

            // Tạo dịch vụ Drive.
            var service = new DriveService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "Google Drive API .NET Quickstart",
            });

            // ID của thư mục trên Google Drive bạn muốn upload file vào.
            string folderId = "1X7dc7NCaZYgwrmpDqK6_8YEqBeWDyPXY";
            var name = _movieRepository.GetById(movie.IdMovie);
            var fileMetadata = new Google.Apis.Drive.v3.Data.File()
            {
                Name = name.Name,
                Parents = new[] { folderId }
            };

            FilesResource.CreateMediaUpload request;
            using (var stream = new FileStream(movie.Url, FileMode.Open))
            {
                request = service.Files.Create(fileMetadata, stream, "video/mp4");
                request.Fields = "id";
                request.Upload();
            }

            var file = request.ResponseBody;
            Console.WriteLine("File ID: " + file.Id);

            // Lấy mã nhúng từ ID của tập tin
            string embedCode = GetEmbedCode(file.Id);

            return embedCode;
        }


        [HttpPatch]
        public ActionResult UpdateMovie([FromBody] Movie updatedMovie)
        {
            try
            {
                var existingMovie = _movieRepository.GetById(updatedMovie.Id);
                if (existingMovie != null)
                {
                    existingMovie.Name = updatedMovie.Name;
                    existingMovie.Description = updatedMovie.Description;
                    existingMovie.UrlTrailer = updatedMovie.UrlTrailer;
                    existingMovie.UrlImg = updatedMovie.UrlImg;
                    existingMovie.UrlImgCover = updatedMovie.UrlImgCover;
                    existingMovie.SubLanguage = updatedMovie.SubLanguage;
                    existingMovie.MinAge = updatedMovie.MinAge;
                    existingMovie.Quality = updatedMovie.Quality;
                    existingMovie.Time = updatedMovie.Time;
                    existingMovie.YearCreate = updatedMovie.YearCreate;
                    existingMovie.Type = updatedMovie.Type;
                    existingMovie.View = updatedMovie.View;
                    existingMovie.Episodes = updatedMovie.Episodes;
                    existingMovie.Genres = updatedMovie.Genres;
                    existingMovie.Actor = updatedMovie.Actor;
                    _movieRepository.Update(existingMovie);
                    _movieRepository.Save();

                    return Ok(existingMovie);
                }
                else
                {
                    return NotFound("Movie not found");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ShowDetail")]
        public ActionResult<Movie> ShowDetail(int id)
        {
            try
            {
                var movie = _movieRepository.GetById(id);
                movie.Genres = _movieRepository.GetGenreByMovieId(movie.Id);
                movie.Actor = _movieRepository.GetActorByMovieId(movie.Id);
                return Ok(movie);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpDelete]
        public ActionResult Delete(int id)
        {
            try
            {
                var movie = _movieRepository.GetById(id);
                if (movie != null)
                {
                    _movieRepository.Delete(movie);
                    _movieRepository.Save();
                    return Ok("Delete Movie Success");
                }
                else
                {
                    return NotFound("Movie not found");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet]
        [Route("HistoryMovie")]
        public ActionResult HistoryMovie(string id)
        {
            try
            {
                var list = _movieRepository.HistoryMovieByUser(id);

                var options = new JsonSerializerOptions
                {
                    ReferenceHandler = ReferenceHandler.Preserve,
                    // Add other options as needed
                };

                var json = JsonSerializer.Serialize(list, options);

                return Ok(json);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
