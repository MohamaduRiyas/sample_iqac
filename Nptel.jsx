import React, { useState, useMemo } from 'react';
import './Nptel.css';

const initialData = [
  { username: "user_1", designation: "Designer" },
  { username: "user_2", designation: "Admin" },
  { username: "user_1", designation: "Designer" },
  { username: "user_2", designation: "Developer" },
  { username: "user_3", designation: "Project Manager" },
  { username: "user_4", designation: "Quality Assurance" },
  { username: "user_5", designation: "Sales Executive" },
  { username: "user_6", designation: "Human Resources" },
  { username: "user_7", designation: "Marketing Specialist" },
  { username: "user_8", designation: "Technical Support" },
  { username: "user_9", designation: "Operations Manager" },
  { username: "user_10", designation: "Finance Analyst" },
];

function Nptel() {
  const [data, setData] = useState(initialData);
  const [edit, setEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({ username: '', designation: '' });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleEditFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute('name');
    const fieldValue = event.target.value;
    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;
    setEditFormData(newFormData);
  };

  const handleEditClick = (item) => {
    setEdit(item.username);
    const formValues = { username: item.username, designation: item.designation };
    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEdit(null);
  };

  const handleSaveClick = (event) => {
    event.preventDefault();

    const editedItem = {
      username: editFormData.username,
      designation: editFormData.designation
    };

    const newData = [...data];
    const index = data.findIndex((item) => item.username === edit);
    newData[index] = editedItem;

    setData(newData);
    setEdit(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (username) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
      const newData = data.filter(item => item.username !== username);
      setData(newData);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredData = useMemo(() => {
    let sortableItems = [...data];
    if (searchTerm) {
      sortableItems = sortableItems.filter(item =>
        item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.designation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, searchTerm, sortConfig]);

  const currentPageData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return sortedAndFilteredData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, sortedAndFilteredData]);

  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const exportToCSV = (exportData) => {
    const csvString = [
      ["Username", "Designation"],
      ...exportData.map(item => [item.username, item.designation])
    ].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="Nptel">
      <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} />
      <button onClick={() => exportToCSV(sortedAndFilteredData)}>Export to CSV</button>
      <form>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => requestSort('username')}>Username</th>
                <th onClick={() => requestSort('designation')}>Designation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((item) => (
                <tr key={item.username}>
                  <td>
                    {edit === item.username ? (
                      <input
                        type="text"
                        name="username"
                        value={editFormData.username}
                        onChange={handleEditFormChange}
                      />
                    ) : (
                      item.username
                    )}
                  </td>
                  <td>
                    {edit === item.username ? (
                      <input
                        type="text"
                        name="designation"
                        value={editFormData.designation}
                        onChange={handleEditFormChange}
                      />
                    ) : (
                      item.designation
                    )}
                  </td>
                  <td>
                    {edit === item.username ? (
                      <React.Fragment>
                        <button type="button" onClick={handleSaveClick}>
                          Save
                        </button>
                        <button type="button" onClick={handleCancelClick}>
                          Cancel
                        </button>
                      </React.Fragment>
                    ) : (
                      <button onClick={() => handleEditClick(item)}>Edit</button>
                    )}
                    <button onClick={() => handleDelete(item.username)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index} onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}

export default Nptel;
