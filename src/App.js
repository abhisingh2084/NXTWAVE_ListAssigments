import React, { useState, useEffect } from 'react';
import List from './List';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [lists, setLists] = useState([]);
  const [error, setError] = useState(null);
  const [isCreatingList, setIsCreatingList] = useState(false);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);

        const response = await fetch('https://apis.ccbp.in/list-creation/lists');

        if (!response.ok) {
          throw new Error('Failed to fetch lists. Please try again.');
        }

        const data = await response.json();
        setLists(data.lists);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchLists();
  }, []);

  const handleCreateList = (selectedLists) => {
    if (selectedLists.length !== 2) {
      setError('You should select exactly 2 lists to create a new list');
      return;
    }

    setError('');
    setIsCreatingList(true);
  };

  const handleMoveItem = (sourceList, destinationList, itemId) => {
    // Implement move item logic
  };

  const handleCancelListCreation = () => {
    setIsCreatingList(false);
  };

  const handleUpdateList = () => {
    setIsCreatingList(false);
    // You may want to update the state or make an API call to update the server with the changes
  };

  return (
    <div className="App">
        <div className="app-container">
        <h1>Lists Creation</h1>

        {isLoading && <p>Loading...</p>}

        {error && (
          <div>
            <img src="https://assets.ccbp.in/frontend/content/react-js/list-creation-failure-lg-output.png" alt="Failure View" />
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        )}

        {!isLoading && !error && (
          <List
            lists={lists}
            onCreateList={handleCreateList}
            onMoveItem={handleMoveItem}
            onCancelListCreation={handleCancelListCreation}
            onUpdateList={handleUpdateList}
            setLists={setLists}
          />
        )}
      </div>
    </div>
  );
}

export default App;