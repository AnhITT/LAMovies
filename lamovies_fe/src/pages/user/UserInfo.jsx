import React, { useState, useEffect } from 'react';
import './style.css';
import { GetInfoPricing } from '~/api/pricing/pricing';
import AuthService from '~/service/auth/auth-service';
import { Link } from 'react-router-dom';

const UserInfo = () => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [infoPricing, setInfoPricing] = useState(undefined);
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
                setInfoPricing(await GetInfoPricing(currentUser.Id));
            }
        };

        fetchPricing();
    }, [currentUser]);
    const formatDateTime = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        const formattedDateTime = dateTime.toLocaleString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        });
        return formattedDateTime;
    };
    const formatRemainingTime = (remainingTime) => {
        const timeParts = remainingTime.split(':');
        const days = parseInt(timeParts[0]);
        const timeString = timeParts.slice(1).join(':');
        const remainingTimeSpan = `${days} ${timeString}`;

        const remainingTimeObj = {
            days: days,
            hours: parseInt(timeParts[1]),
            minutes: parseInt(timeParts[2]),
            seconds: parseFloat(timeParts[3]),
        };

        if (remainingTimeObj.days < 0) {
            return 'Hết hạn';
        } else {
            return `${remainingTimeObj.days}d ${remainingTimeObj.hours}h ${remainingTimeObj.minutes}m`;
        }
    };
    return (
        <>
            <nav className="container-fluid">
                <strong className="title-checkout">LA Movies | Infomation Account</strong>
            </nav>
            <main className="container">
                <div className="grid">
                    <section className="custom-form-section">
                        <form className="my-form container">
                            <ul className="ul-checkout">
                                <li>
                                    <div className="grid grid-2">
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            required
                                            value={currentUser ? currentUser.FullName : ''}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            required
                                            value={currentUser ? currentUser.Username : ''}
                                        />
                                    </div>
                                </li>
                                <li>
                                    <div className="grid grid-2">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            required
                                            value={currentUser ? currentUser.Email : ''}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Date Birthday"
                                            value={currentUser ? currentUser.Date : ''}
                                        />
                                    </div>
                                </li>
                                <li>
                                    <div className="grid grid-2">
                                        <input
                                            type="text"
                                            placeholder="text"
                                            disabled
                                            required
                                            value={infoPricing ? infoPricing.namePricing : ''}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Date Birthday"
                                            disabled
                                            value={
                                                'Start time:' + formatDateTime(infoPricing ? infoPricing.startTime : '')
                                            }
                                        />
                                    </div>
                                </li>
                                <li>
                                    <div className="grid grid-2">
                                        <input
                                            type="text"
                                            placeholder="Email"
                                            disabled
                                            required
                                            value={'End time:' + formatDateTime(infoPricing ? infoPricing.endTime : '')}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Date Birthday"
                                            disabled
                                            value={
                                                'Remaining Time: ' +
                                                formatRemainingTime(infoPricing ? infoPricing.remainingTime : '')
                                            }
                                        />
                                    </div>
                                </li>
                                <li>
                                    <div className="grid grid-3 btn-checkout">
                                        <Link to="/changepassword">
                                            <button className="btn-paypal" type="submit">
                                                CHANGE PASSWORD
                                            </button>
                                        </Link>

                                        <Link to="/">
                                            <button className="btn-grid" type="reset">
                                                BACK
                                            </button>
                                        </Link>
                                    </div>
                                </li>
                                <p align="left"> <a href="https://developer.android.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/android/android-original-wordmark.svg" alt="android" width="40" height="40"/> </a> <a href="https://babeljs.io/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/babeljs/babeljs-icon.svg" alt="babel" width="40" height="40"/> </a> <a href="https://getbootstrap.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-plain-wordmark.svg" alt="bootstrap" width="40" height="40"/> </a> <a href="https://www.cprogramming.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/c/c-original.svg" alt="c" width="40" height="40"/> </a> <a href="https://www.w3schools.com/cpp/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg" alt="cplusplus" width="40" height="40"/> </a> <a href="https://www.w3schools.com/cs/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/csharp/csharp-original.svg" alt="csharp" width="40" height="40"/> </a> <a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/> </a> <a href="https://www.docker.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40"/> </a> <a href="https://dotnet.microsoft.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/dot-net/dot-net-original-wordmark.svg" alt="dotnet" width="40" height="40"/> </a> <a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a> <a href="https://firebase.google.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" alt="firebase" width="40" height="40"/> </a> <a href="https://git-scm.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" alt="git" width="40" height="40"/> </a> <a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/> </a> <a href="https://www.java.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg" alt="java" width="40" height="40"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> <a href="https://www.mongodb.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="mongodb" width="40" height="40"/> </a> <a href="https://www.microsoft.com/en-us/sql-server" target="_blank" rel="noreferrer"> <img src="https://www.svgrepo.com/show/303229/microsoft-sql-server-logo.svg" alt="mssql" width="40" height="40"/> </a> <a href="https://www.mysql.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="40" height="40"/> </a> <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a> <a href="https://www.postgresql.org" target="_blank" 
                            </ul>
                        </form>
                    </section>
                </div>
            </main>
        </>
    );
};

export default UserInfo;
