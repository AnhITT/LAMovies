import React, { useState, useEffect } from 'react';
import '../../components/watch/style.css';
import { useParams } from 'react-router-dom';
import { GetMovieByID, GetURLOddMovie } from '~/api/homes/home';
import { CheckPricing } from '~/api/pricing/pricing';
import { CreateRoom } from '~/api/room/room';
import AuthService from '~/service/auth/auth-service';
import { useHistory } from 'react-router-dom';

const WatchMovie = () => {
    const history = useHistory();
    const { id } = useParams();
    const [movie, setMovie] = useState([]);
    const [url, setUrl] = useState('');
    const [currentUser, setCurrentUser] = useState(undefined);
    const [check, setCheck] = useState();

    // Hàm kiểm tra việc mở Developer Tools
    const isDevToolsOpened = () => {
        const widthThreshold = 160;
        const heightThreshold = 160;

        function checkWindowBounds() {
            const widthChanged = window.outerWidth - window.innerWidth > widthThreshold;
            const heightChanged = window.outerHeight - window.innerHeight > heightThreshold;
            return widthChanged || heightChanged;
        }

        // Kiểm tra sự thay đổi của kích thước cửa sổ mỗi giây
        setInterval(() => {
            if (checkWindowBounds()) {
                // Nếu phát hiện Developer Tools được mở, thực hiện các hành động phù hợp ở đây
                // Ví dụ: có thể chuyển hướng người dùng hoặc hiển thị thông báo cảnh báo
                alert('Please do not open Developer Tools!');
            }
        }, 1000); // Kiểm tra mỗi giây
    };

    useEffect(() => {
        const fetchData = async () => {
            if (AuthService.getCurrentUser()) {
                setCurrentUser(await AuthService.getCurrentUser());
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchPricing = async () => {
            if (currentUser) {
                setCheck(await CheckPricing(currentUser.Id));
            }
        };

        fetchPricing();
    }, [currentUser]);

    useEffect(() => {
        const fetchData = async () => {
            const movieData = await GetMovieByID(id);
            setMovie(movieData);
            if (check) {
                const data = await GetURLOddMovie(movieData.id);
                setUrl(data.url); // Lấy trực tiếp đường dẫn video từ data.url
            }
        };
        fetchData();

        // Kiểm tra việc mở Developer Tools khi component được render
        isDevToolsOpened();
    }, [check, id]);

    const handleWatchWithFriends = async () => {
        try {
            const response = await CreateRoom(movie.name, currentUser.Id);
            history.push(`/room/${response}/${id}`);
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    return (
        <>
            {check === true ? (
                <>
                    <section className="singlePage">
                        <div className="singleHeading">
                            <h1>Movie {movie.name} </h1> <span> | {movie.time} | </span> <span> {movie.quality} </span>
                        </div>
                        <div className="container">
                            {url && (
                                <iframe
                                    src={url}
                                    width="100%"
                                    height="605px"
                                    frameBorder="0"
                                    allowFullScreen
                                    title="Embedded Content"
                                ></iframe>
                            )}
                            <div className="para">
                                <button id="btnbtn" className="btn-play primary-btn" onClick={handleWatchWithFriends}>
                                    <i className="fas fa-play"></i> WATCH WITH FRIENDS
                                </button>
                            </div>

                            <div className="para">
                                <h3>Description:</h3>
                                <p>{movie.description}</p>
                            </div>
                            <div className="soical">
                                <h3>Share : </h3>
                                <img
                                    src="https://img.icons8.com/color/48/000000/facebook-new.png"
                                    alt="Facebook Icon"
                                />
                                <img
                                    src="https://img.icons8.com/fluency/48/000000/twitter-circled.png"
                                    alt="Twitter Icon"
                                />
                                <img
                                    src="https://img.icons8.com/fluency/48/000000/linkedin-circled.png"
                                    alt="LinkedIn Icon"
                                />
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <section className="singlePage">
                    <div className="singleHeading">
                        <h1>Movie {movie.name} </h1> <span> | {movie.time} | </span> <span> {movie.quality} </span>
                    </div>
                    <div className="container">
                        <div className="para">
                            <div className="singleHeading">
                                <h1>PLEASE REGISTER TO USE THE SERVICE TO WATCH MOVIES</h1>
                            </div>
                        </div>

                        <div className="para">
                            <h3>Description:</h3>
                            <p>{movie.description}</p>
                        </div>
                        <div className="soical">
                            <h3>Share : </h3>
                            <img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="Facebook Icon" />
                            <img
                                src="https://img.icons8.com/fluency/48/000000/twitter-circled.png"
                                alt="Twitter Icon"
                            />
                            <img
                                src="https://img.icons8.com/fluency/48/000000/linkedin-circled.png"
                                alt="LinkedIn Icon"
                            />
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default WatchMovie;
