import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// 导入组件
import Forum from './components/Forum';
import CreatePost from './components/Forum/CreatePost';
import CommunitySupport from './components/CommunitySupport';
import AboutUs from './components/AboutUs';
import DestinationForm from './components/DestinationForm';
import Weather from './components/Weather/index.jsx';
import Report from './components/Report';
import SixHourReport from './components/SixHourReport';
import EightHourReport from './components/EightHourReport';
import NineHourReport from './components/NineHourReport';
import CommunityTips from './components/CommunityTips';
import DrivingSummary from './components/DrivingSummary';
import FeelUnwell from './components/FeelUnwell';
import AppointmentSuccess from './components/AppointmentSuccess';
import SummaryQuestion from './components/SummaryQuestion';
import DestinationConfirmation from './components/DestinationConfirmation';
import DestinationSuccess from './components/DestinationSuccess';
import MusicPlayer from './components/MusicPlayer/index.jsx';

// 定义主要的App组件
function App() {
  return (
    <Router>
      <Routes>
        {/* 定义主页路由 */}
        <Route path="/" element={
          <div className="App">
            <header className="App-header">
              {/* 应用的Logo和欢迎标题 */}
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Schneider_National_logo.svg" alt="Schneider Logo" className="app-logo"/>
              <h1>Welcome to Schneider Truck</h1>
            </header>
            <nav className="App-nav">
              {/* 导航链接，使用<Link>组件实现路由跳转 */}
              <Link to="/destination" className="nav-button">Enter Your Destination</Link>
              <Link to="/report" className="nav-button">Report Time</Link>
              <Link to="/weather" className="nav-button">Weather Today</Link>
              <Link to="/about_us" className="nav-button">About US</Link>
              <Link to="/community_tips" className="nav-button">Community Tips</Link>
              <Link to="/driving_summary" className="nav-button">Driving Summary</Link>
              <Link to="/community_support" className="nav-button">Community Support</Link>
              <Link to="/music_player" className="nav-button">Music Player</Link>
            </nav>
          </div>
        } />
        {/* 路由到各个组件 */}
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/create" element={<CreatePost />} />
        <Route path="/about_us" element={<AboutUs />} />
        <Route path="/destination" element={<DestinationForm />} />
        <Route path="/destination/confirmation" element={<DestinationConfirmation />} />
        <Route path="/destination/success" element={<DestinationSuccess />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/report" element={<Report />} />
        <Route path="/report/6hour" element={<SixHourReport />} />
        <Route path="/report/8hour" element={<EightHourReport />} />
        <Route path="/report/9hour" element={<NineHourReport />} />
        <Route path="/community_tips" element={<CommunityTips />} />
        <Route path="/driving_summary" element={<DrivingSummary />} />
        <Route path="/feel_unwell" element={<FeelUnwell />} />
        <Route path="/summary_question" element={<SummaryQuestion />} />
        <Route path="/appointment_success" element={<AppointmentSuccess />} />
        <Route path="/summary_question" element={<SummaryQuestion />} />
        <Route path="/community_support" element={<CommunitySupport />} />
        <Route path="/music_player" element={<MusicPlayer />} />
      </Routes>
    </Router>
  );
}

export default App;
