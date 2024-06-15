import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Dashboard = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState({});
    const [quizzes, setQuizzes] = useState([]);
    const [showDetails, setShowDetails] = useState(false); 
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(`http://localhost:5001/api/users/${userId}`);
                const quizzesResponse = await axios.get(`http://localhost:5001/api/users/${userId}/quizzes`);
                setUserDetails(userResponse.data);
                setQuizzes(quizzesResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
            }
        };

        fetchData();
    }, [userId]);

    const toggleDetails = (quiz) => {
        setSelectedQuiz(quiz);
        setShowDetails(!showDetails);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ fontFamily: 'Arial', padding: '20px' }}>
            <h1>Temporary Dashboard</h1>
            <div style={{ marginBottom: '20px' }}>
                <h2>User Details</h2>
                <p>Name: {userDetails.name}</p>
                <p>Email: {userDetails.email}</p>
            </div>
            <div>
                <h2>Quizzes</h2>
                <select style={{ width: '200px', padding: '10px', cursor: 'pointer' }} onChange={(e) => toggleDetails(quizzes[e.target.value])}>
                    <option>Select a quiz</option>
                    {quizzes.map((quiz, index) => (
                        <option key={quiz.id} value={index}>
                            {quiz.quiz_title}
                        </option>
                    ))}
                </select>
            </div>
            {showDetails && selectedQuiz && (
                <div style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3>{selectedQuiz.quiz_title}</h3>
                    <p>Created at: {selectedQuiz.created_at}</p>
                    <p>Privacy: {selectedQuiz.privacy}</p>
                    <button onClick={() => setShowDetails(false)} style={{ padding: '10px 20px', cursor: 'pointer' }}>Close</button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
