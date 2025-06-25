import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoutes';
import JournalPage from './pages/Journal';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import JournalEditor from './components/JournalEditor';
const App = () => {
  return (
<Router>
<Routes>
  
  <Route path="/" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />
  <Route path="/journal" element={
    <PrivateRoute>
      <JournalPage />
    </PrivateRoute>
  } />
  <Route path="/journal/new" element={<JournalEditor />} />

</Routes>
</Router>
  );
}
export default App;   
