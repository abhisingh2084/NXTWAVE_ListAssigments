import React, { useState } from 'react';
import './List.css';

const List = ({ lists, onCreateList, onMoveItem, onCancelListCreation, onUpdateList, setLists }) => {
  const [selectedLists, setSelectedLists] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListContent, setNewListContent] = useState([]);

  const handleCheckboxChange = (listNumber) => {
    const updatedSelectedLists = [...selectedLists];
    const index = updatedSelectedLists.indexOf(listNumber);

    if (index === -1) {
      updatedSelectedLists.push(listNumber);
    } else {
      updatedSelectedLists.splice(index, 1);
    }

    setSelectedLists(updatedSelectedLists);
  };

  const handleCreateList = () => {
    if (selectedLists.length !== 2) {
      setErrorMessage('You should select exactly 2 lists to create a new list');
      return;
    }

    setErrorMessage('');
    setIsCreatingList(true);

    const [firstList, secondList] = selectedLists;

    const newListNumber = determineNewListNumber(selectedLists, lists);

    const updatedLists = [...lists];

    const firstListIndex = updatedLists.findIndex((list) => list.list_number === firstList);
    const secondListIndex = updatedLists.findIndex((list) => list.list_number === secondList);

    // Insert the new list between the selected lists
    updatedLists.splice(secondListIndex, 0, { id: 'newList', list_number: newListNumber, items: [] });

    onCreateList(selectedLists);

    setLists(updatedLists);
  };

  const handleMoveItemInCreationView = (sourceList, destinationList, itemId) => {
    const updatedLists = [...lists];

    const sourceListIndex = updatedLists.findIndex((list) => list.list_number === sourceList);
    const destinationListIndex = updatedLists.findIndex((list) => list.list_number === destinationList);

    const itemIndex = updatedLists[sourceListIndex].items.findIndex((item) => item.id === itemId);

    const movedItem = updatedLists[sourceListIndex].items.splice(itemIndex, 1)[0];
    updatedLists[destinationListIndex].items.push(movedItem);

    onMoveItem(sourceList, destinationList, itemId);

    setLists(updatedLists);
  };

  const handleMoveItemToNewList = (item) => {
    setNewListContent((prevContent) => [...prevContent, item]);
  };

  const handleMoveItemFromNewList = (destinationList, itemId) => {
    const movedItem = newListContent.find((item) => item.id === itemId);
    setNewListContent((prevContent) => prevContent.filter((item) => item.id !== itemId));
    handleMoveItemInCreationView('newList', destinationList, itemId);
  };

  const handleCancelCreation = () => {
    setIsCreatingList(false);
    setNewListContent([]);
    onCancelListCreation();
  };

  const handleUpdateList = () => {
    setIsCreatingList(false);
    setNewListContent([]);
    onUpdateList();
  };

  const separateLists = lists.reduce((acc, item) => {
    acc[item.list_number] = [...(acc[item.list_number] || []), item];
    return acc;
  }, {});

  return (
    <div>
      <div className="create-list-container">
        <button className="create-list-btn" onClick={handleCreateList}>
          Create a new list
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      {isCreatingList && (
        <div className="list-number-display">
          <h4>Total List Count: {lists.length}</h4>
        </div>
      )}

      <div className="list-container">
        {Object.entries(separateLists).map(([listNumber, items]) => {
          const isNewList = isCreatingList && listNumber === determineNewListNumber(selectedLists, lists);

          if (isNewList) {
            const firstCheckedList = (
              <div key={listNumber} className="list-card">
                <div className="list-header">
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(listNumber)}
                    checked={selectedLists.includes(listNumber)}
                  />
                  <h4>List {listNumber}</h4>
                  {isCreatingList && <span className="list-count">({items.length})</span>}
                </div>
                {items.map((item) => (
                  <div key={item.id} className="card">
                    <span>{item.name}</span>
                    <div className="arrow" onClick={() => handleMoveItemToNewList(item)}>
                      ➡️
                    </div>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            );

            const newListContainer = (
              <div key="newList" className="card new-list-card">
                {newListContent.map((item) => (
                  <div key={item.id} className="list-item">
                    <span>{item.name}</span>
                    <div className="arrow" onClick={() => handleMoveItemFromNewList(selectedLists[1], item.id)}>
                      ➡️
                    </div>
                    <div className="arrow" onClick={() => handleMoveItemFromNewList(selectedLists[0], item.id)}>
                      ⬅️
                    </div>
                  </div>
                ))}
              </div>
            );

            const secondCheckedList = (
              <div key={listNumber + 1} className="list-card">
                <div className="list-header">
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(listNumber + 1)}
                    checked={selectedLists.includes(listNumber + 1)}
                  />
                  <h4>List {listNumber + 1}</h4>
                  {isCreatingList && <span className="list-count">(){items.length}</span>}
                </div>
                {items.map((item) => (
                  <div key={item.id} className="card">
                    <span>{item.name}</span>
                    <div className="arrow" onClick={() => handleMoveItemToNewList(item)}>
                      ➡️
                    </div>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            );

            return [firstCheckedList, newListContainer, secondCheckedList];
          }

          return (
            <div key={listNumber} className="list-card">
              <div className="list-header">
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(listNumber)}
                  checked={selectedLists.includes(listNumber)}
                />
                <h4>List {listNumber}</h4>
                {isCreatingList && <span className="list-count">({items.length})</span>}
              </div>
              {items.map((item) => (
                <div key={item.id} className="card">
                  <span>{item.name}</span>
                  <div className="arrow" onClick={() => handleMoveItemToNewList(item)}>
                    ➡️
                  </div>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {isCreatingList && (
        <div className="list-creation-view">
          <button onClick={handleCancelCreation}>Cancel</button>
          <button onClick={handleUpdateList} className="update-btn">
            Update
          </button>
        </div>
      )}
    </div>
  );
};

export default List;

function determineNewListNumber(selectedLists, allLists) {
  const sortedListNumbers = selectedLists
    .map((listIndex) => allLists[listIndex]?.list_number)
    .filter((listNumber) => listNumber !== undefined)
    .sort((a, b) => a - b);

  let newListNumber = sortedListNumbers[0] + 1;

  while (allLists.some((list) => list.list_number === newListNumber)) {
    newListNumber++;
  }

  return newListNumber;
}
