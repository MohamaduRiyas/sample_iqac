import React, { useState, useEffect } from "react";
import "./markentry.css";
import apiHost from "../../../utils/api";
import Dropdown from "../../../components/dropdown/dropdown";
import InputBox from "../../../components/InputBox/inputbox";
import Button from "../../../components/Button/button";
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto'; // This import is necessary for Chart.js 3.x


function Markentry() {
  const [academicyearOptions, setAcademicyearOptions] = useState([]);
  const [academicyear, setAcademicyear] = useState("");
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [semester, setSemester] = useState("");
  const [testtypeOptions, setTestTypeOptions] = useState([]);
  const [testtype, setTestType] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [subject, setSubject] = useState("");
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [faculty, setFaculty] = useState("");
  const [selectedCount, setSelectedCount] = useState(1);
  const [courseoutcomes, setCourseOutcomes] = useState(Array(10).fill(""));
  const [marks, setMarks] = useState([Array(10).fill(""), Array(10).fill("")]);
  const [students, setStudents] = useState([
    { name: "Student 1", id: "7376221CS223" },
    { name: "Student 2", id: "7376221CS224" },
    
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setAcademicyearOptions([{ value: "2021-2022", label: "2021-2022" }, { value: "2022-2023", label: "2022-2023" }]);
    setSemesterOptions([{ value: "1", label: "1" }, { value: "2", label: "2" }]);
    setTestTypeOptions([{ value: "PT-1", label: "PT-1" }, { value: "PT-2", label: "PT-2" }]);
    setSubjectOptions([{ value: "SUBJECT-1", label: "SUBJECT-1" }, { value: "SUBJECT-2", label: "SUBJECT-2" }]);
    setFacultyOptions([{ value: "FACULTY-1", label: "FACULTY-1" }, { value: "FACULTY-2", label: "FACULTY-2" }]);
  }, []);

  const handleCountChange = (selectedOption) => {
    setSelectedCount(selectedOption.value);
    setCourseOutcomes(Array(selectedOption.value).fill(""));
    setMarks(students.map(() => Array(selectedOption.value).fill("")));
  };

  const handleMaxMarkChange = (index, value) => {
    const updatedCourseOutcomes = [...courseoutcomes];
    updatedCourseOutcomes[index] = value;
    setCourseOutcomes(updatedCourseOutcomes);
  };

  const handleUpdateCourseOutcome = (index) => {
    const value = courseoutcomes[index];
    // Adjust existing marks that exceed the new max value for this course outcome
    const updatedMarks = marks.map(studentMarks =>
      studentMarks.map((mark, mIdx) => (mIdx === index && Number(mark) > Number(value) ? value : mark))
    );
    setMarks(updatedMarks);
  };

  const handleMarkChange = (studentIndex, markIndex, value) => {
    let adjustedValue = Number(value) > Number(courseoutcomes[markIndex]) ? courseoutcomes[markIndex] : value;
    const updatedMarks = [...marks];
    updatedMarks[studentIndex][markIndex] = adjustedValue;
    setMarks(updatedMarks);
  };

  const calculateTotal = (studentIndex) => {
    return marks[studentIndex].reduce((acc, mark) => acc + (Number(mark) || 0), 0);
  };

  const MyDoughnutChartComponent = () => {
    // Sample data for the Doughnut chart
    const data = {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          label: 'My First Dataset',
          data: [300, 50, 100],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  
    return <Doughnut data={data} />;
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteCourseOutcome = (index) => {
    const updatedCourseOutcomes = courseoutcomes.filter((_, i) => i !== index);
    setCourseOutcomes(updatedCourseOutcomes);
    const updatedMarks = marks.map(studentMarks => studentMarks.filter((_, i) => i !== index));
    setMarks(updatedMarks);
    setSelectedCount(prevCount => prevCount - 1);
  };

  const filteredStudents = searchTerm.length ? students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toString().includes(searchTerm)
  ) : students;

  return (
    <div className="container">
      <div className="dropdown-container">
        <Dropdown options={academicyearOptions} value={academicyear} onChange={setAcademicyear} placeholder="Academic Year" />
        <Dropdown options={semesterOptions} value={semester} onChange={setSemester} placeholder="Semester" />
        <Dropdown options={testtypeOptions} value={testtype} onChange={setTestType} placeholder="Test Type" />
        <Dropdown options={subjectOptions} value={subject} onChange={setSubject} placeholder="Subject" />
        <Dropdown options={facultyOptions} value={faculty} onChange={setFaculty} placeholder="Faculty Name" />
        <Dropdown options={[...Array(10).keys()].map(i => ({ value: i + 1, label: `${i + 1}` }))}
          value={{ value: selectedCount, label: `${selectedCount}` }} onChange={handleCountChange} placeholder="Select Count" />
      </div>

      <div className="white-containers">
        {[...Array(selectedCount)].map((_, index) => (
          <div key={index} className="white-container">
            <div className="mark-and-button">
              <label>Course Outcome {index + 1}</label>
              <InputBox
                type="number"
                value={courseoutcomes[index]}
                onChange={(e) => handleMaxMarkChange(index, e.target.value)}
              />
              <Button label="Update" onClick={() => handleUpdateCourseOutcome(index)} />
              <Button label="Delete" onClick={() => handleDeleteCourseOutcome(index)} />
            </div>
          </div>
        ))}
      </div>

      <div className="table-container">
        <InputBox type="text" placeholder="Student Name/Reg.." value={searchTerm} onChange={handleSearchChange} />
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              {[...Array(selectedCount)].map((_, i) => <th key={i}>Mark {i + 1}</th>)}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, studentIndex) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.id}</td>
                {[...Array(selectedCount)].map((_, markIndex) => (
                  <td key={markIndex}>
                    <InputBox
                      type="number"
                      value={marks[studentIndex][markIndex]}
                      onChange={(e) => handleMarkChange(studentIndex, markIndex, e.target.value)}
                    />
                  </td>
                ))}
                <td>{calculateTotal(studentIndex)}</td>
              </tr>
            ))}
          </tbody>
          
        </table>
        
      </div >
    </div>
  
  );
}

export default Markentry;
