import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import {AppProvider, useAppContext} from './context/AppContext';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainLayout from "./layouts/MainLayout.jsx";
import Register from './pages/Register';
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Login from './pages/Login';
import Home from './pages/Home';
import Intro from './pages/Introduction.jsx';
import ResetPassword from "./pages/ResetPassword.jsx";

import AnswererForgotPassword from "./pages/influencer/AnswererForgotPassword.jsx";
import AnswererLayout from './layouts/AnswererLayout';
import InfluencerDashboard from './pages/influencer/InfluencerDashboard.jsx';
import EditInfluencerProfile from "./pages/influencer/EditInfluencerProfile.jsx";
import QuestionsDashboard from "./pages/influencer/QuestionsDashboard.jsx";
import AnswererViewQuestion from "./pages/influencer/AnswererViewQuestion.jsx";
import Withdrawal from "./pages/influencer/Withdrawal.jsx";

import QuestionerLayout from './layouts/QuestionerLayout';
import EditQuestionerProfile from "./pages/questioner/EditQuestionerProfile.jsx";
import QuestionerDashboard from "./pages/questioner/QuestionerDashboard.jsx";
import BrowseInfluencers from "./pages/questioner/BrowseInfluencers.jsx";
import ViewInfluencer from "./pages/questioner/ViewInfluencer.jsx";
import AskQuestion from "./pages/questioner/AskQuestion.jsx";
import QuestionerViewQuestion from "./pages/questioner/QuestionerViewQuestion.jsx";
import MyQuestions from "./pages/questioner/MyQuestions.jsx";
import QuestionerForgotPassword from "./pages/questioner/QuestionerForgotPassword.jsx";
import WithTitle from "./components/WithTitle.jsx";
import ListWithdrawals from "./pages/ListWithdrawals.jsx";
import EditQuestion from "./pages/questioner/EditQuestion.jsx";
import {VISITED_MENTOR_PROFILE_KEY} from "./utils/helpers.js";
import {useEffect} from "react";
import HowItWorks1 from "./pages/HowItWorks1.jsx";
import HowItWorks2 from "./pages/HowItWorks2.jsx";


const DashboardRouter = () => {
    const {userToken, userType} = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (userToken && userType === 'questioner') {
            const visitedUrl = sessionStorage.getItem(VISITED_MENTOR_PROFILE_KEY);
            if (visitedUrl) {
                sessionStorage.removeItem(VISITED_MENTOR_PROFILE_KEY);
                navigate(visitedUrl);
            }
        }
    }, [userToken, userType, navigate]);

    if (!userToken) return <Home/>;
    if (userType === 'answerer') return <Navigate to="/mentor"/>;
    if (userType === 'questioner') return <Navigate to="/questioner"/>;
    return <Navigate to="/login"/>;
};

const publicRoutes = [
    {path: '/', title: '', component: DashboardRouter},
    {path: '/register', title: 'Register', component: Register},
    {path: '/login', title: 'Login', component: Login},
    {path: '/verify-email', title: 'Verify Email', component: VerifyEmail},
    {path: '/reset-password', title: 'Reset Password', component: ResetPassword},
    {path: '/answerer-forgot-password', title: 'Forgot Password (Mentor)', component: AnswererForgotPassword},
    {path: '/questioner-forgot-password', title: 'Forgot Password (User)', component: QuestionerForgotPassword},
    {path: '/view-mentor', title: 'View Mentor', component: ViewInfluencer},
    {path: '/list-withdrawals', title: 'List withdrawals', component: ListWithdrawals},
    {path: '/introduction', title: 'Introduction', component: Intro},
    {path: '/how-it-works1', title: 'How It Works', component: HowItWorks1},
    {path: '/how-it-works2', title: 'How It Works', component: HowItWorks2},

    // Add more as needed
];
const answererRoutes = [
    {path: '', title: 'Mentor Dashboard', component: InfluencerDashboard},
    {path: 'edit-profile', title: 'Edit Profile', component: EditInfluencerProfile},
    {path: 'questions', title: 'My Questions', component: QuestionsDashboard},
    {path: 'view-question', title: 'View Question', component: AnswererViewQuestion},
    {path: 'withdrawal', title: 'Withdrawal', component: Withdrawal},
];

const questionerRoutes = [
    {path: '', title: 'User Dashboard', component: QuestionerDashboard},
    {path: 'edit-profile', title: 'Edit Profile', component: EditQuestionerProfile},
    {path: 'browse-mentors', title: 'Browse Mentors', component: BrowseInfluencers},
    {path: 'ask-question', title: 'Ask Question', component: AskQuestion},
    {path: 'view-question', title: 'View Question', component: QuestionerViewQuestion},
    {path: 'edit-question', title: 'Edit Question', component: EditQuestion},
    {path: 'my-questions', title: 'My Questions', component: MyQuestions},
];

const App = () => {
    return (
        <AppProvider>
            <Routes>
                <Route path="/" element={<MainLayout/>}>
                    {publicRoutes.map(({path, title, component: Component}) => (
                        <Route
                            key={path}
                            path={path}
                            element={
                                <WithTitle title={title}>
                                    <Component/>
                                </WithTitle>
                            }
                        />
                    ))}
                    {/* Answerer Protected Routes */}
                    <Route path="/mentor" element={<AnswererLayout/>}>
                        {answererRoutes.map(({path, title, component: Component}) => (
                            <Route
                                key={path}
                                path={path}
                                element={
                                    <WithTitle title={title}>
                                        <Component/>
                                    </WithTitle>
                                }
                            />
                        ))}
                    </Route>

                    {/* Answerer Protected Routes */}
                    <Route path="/questioner" element={<QuestionerLayout/>}>
                        {questionerRoutes.map(({path, title, component: Component}) => (
                            <Route
                                key={path}
                                path={path}
                                element={
                                    <WithTitle title={title}>
                                        <Component/>
                                    </WithTitle>
                                }
                            />
                        ))}
                    </Route>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Route>
            </Routes>

            <ToastContainer
                position="top-right"
                autoClose={2000}
                draggable
                theme="colored"
            />
        </AppProvider>
    );
};

export default App;
