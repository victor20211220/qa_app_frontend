import {Routes, Route, Navigate} from 'react-router-dom';
import {AppProvider, useAppContext} from './context/AppContext';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainLayout from "./layouts/MainLayout.jsx";
import Register from './pages/Register';
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Login from './pages/Login';
import Home from './pages/Home';
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


const DashboardRouter = () => {
    const {userToken, userType} = useAppContext();
    if (!userToken) return <Home/>;
    if (userType === 'answerer') return <Navigate to="/influencer"/>;
    if (userType === 'questioner') return <Navigate to="/questioner"/>;
    return <Navigate to="/login"/>;
};

const publicRoutes = [
    {path: '/', title: '', component: DashboardRouter},
    {path: '/register', title: 'Register', component: Register},
    {path: '/login', title: 'Login', component: Login},
    {path: '/verify-email', title: 'Verify Email', component: VerifyEmail},
    {path: '/reset-password', title: 'Reset Password', component: ResetPassword},
    {path: '/answerer-forgot-password', title: 'Forgot Password (Influencer)', component: AnswererForgotPassword},
    {path: '/questioner-forgot-password', title: 'Forgot Password (User)', component: QuestionerForgotPassword},
    {path: '/view-influencer', title: 'View Influencer', component: ViewInfluencer},
    {path: '/list-withdrawals', title: 'List withdrawals', component: ListWithdrawals},
    // Add more as needed
];
const answererRoutes = [
    {path: '', title: 'Influencer Dashboard', component: InfluencerDashboard},
    {path: 'edit-profile', title: 'Edit Profile', component: EditInfluencerProfile},
    {path: 'questions', title: 'My Questions', component: QuestionsDashboard},
    {path: 'view-question', title: 'View Question', component: AnswererViewQuestion},
    {path: 'withdrawal', title: 'Withdrawal', component: Withdrawal},
];

const questionerRoutes = [
    {path: '', title: 'User Dashboard', component: QuestionerDashboard},
    {path: 'edit-profile', title: 'Edit Profile', component: EditQuestionerProfile},
    {path: 'browse-influencers', title: 'Browse Influencers', component: BrowseInfluencers},
    {path: 'ask-question', title: 'Ask Question', component: AskQuestion},
    {path: 'view-question', title: 'View Question', component: QuestionerViewQuestion},
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
                    <Route path="/influencer" element={<AnswererLayout/>}>
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
