import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

function DarkThemeForm() {
    const [data, setData] = useState({
        fullName: "",
        userEmail: "",
        userPassword: "",
        userGender: "",
        userAddress: "",
        userCity: "",
        userRating: 0,
        userFeedback: "",
    });

    const [savedEntries, setSavedEntries] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [editingMode, setEditingMode] = useState(false);
    const [indexToEdit, setIndexToEdit] = useState(null);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emojiRatings = ["🤔", "😴", "😭", "😤", "😍"];

    useEffect(() => {
        const storedEntries = JSON.parse(localStorage.getItem("savedEntries"));
        if (storedEntries) {
            setSavedEntries(storedEntries);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("savedEntries", JSON.stringify(savedEntries));
    }, [savedEntries]);

    const validateFields = () => {
        let errors = {};
        if (!data.fullName) errors.fullName = "Name is required";
        if (!data.userEmail) {
            errors.userEmail = "Email is required";
        } else if (!emailPattern.test(data.userEmail)) {
            errors.userEmail = "Invalid email address";
        }
        if (!data.userPassword) errors.userPassword = "Password is required";

        if (!data.userAddress) errors.userAddress = "Address is required";
        if (!data.userCity) errors.userCity = "City is required";
        if (!data.userRating) errors.userRating = "Please rate your experience";

        return errors;
    };

    const handleInputChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleRatingClick = (rating) => {
        setData({ ...data, userRating: rating });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length === 0) {
            if (editingMode) {
                const updatedEntries = savedEntries.map((entry, idx) =>
                    idx === indexToEdit ? data : entry
                );
                setSavedEntries(updatedEntries);
                setEditingMode(false);
                setIndexToEdit(null);
            } else {
                setSavedEntries([...savedEntries, data]);
            }
            setData({
                fullName: "",
                userEmail: "",
                userPassword: "",

                userAddress: "",
                userCity: "",
                userRating: 0,
                userFeedback: "",
            });
            setFormErrors({});
        } else {
            setFormErrors(validationErrors);
        }
    };

    const handleEdit = (index) => {
        setData(savedEntries[index]);
        setEditingMode(true);
        setIndexToEdit(index);
    };

    const handleDelete = (index) => {
        const updatedEntries = savedEntries.filter((_, i) => i !== index);
        setSavedEntries(updatedEntries);
    };

    return (
        <div className="centered-container">
            <div className="dark-form p-4 rounded">
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Full Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="fullName"
                            value={data.fullName}
                            onChange={handleInputChange}
                        />
                        {formErrors.fullName && <p className="text-danger">{formErrors.fullName}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email Address:</label>
                        <input
                            type="email"
                            className="form-control"
                            name="userEmail"
                            value={data.userEmail}
                            onChange={handleInputChange}
                        />
                        {formErrors.userEmail && <p className="text-danger">{formErrors.userEmail}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            name="userPassword"
                            value={data.userPassword}
                            onChange={handleInputChange}
                        />
                        {formErrors.userPassword && <p className="text-danger">{formErrors.userPassword}</p>}
                    </div>



                    <div className="mb-3">
                        <label className="form-label">Address:</label>
                        <textarea
                            className="form-control"
                            name="userAddress"
                            value={data.userAddress}
                            onChange={handleInputChange}
                        />
                        {formErrors.userAddress && <p className="text-danger">{formErrors.userAddress}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">City:</label>
                        <select
                            name="userCity"
                            className="form-select"
                            value={data.userCity}
                            onChange={handleInputChange}
                        >
                            <option value="">Select City</option>
                            <option value="surat">surat</option>
                            <option value="Rajkot">Rajkot</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Rampur">Rampur</option>
                        </select>
                        {formErrors.userCity && <p className="text-danger">{formErrors.userCity}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Rating:</label>
                        <div className="rating d-flex">
                            {emojiRatings.map((emoji, index) => (
                                <span
                                    key={index}
                                    onClick={() => handleRatingClick(index + 1)}
                                    style={{
                                        cursor: "pointer",
                                        fontSize: "2rem",
                                        color: data.userRating > index ? "orange" : "gray",
                                    }}
                                >
                                    {emoji}
                                </span>
                            ))}
                        </div>
                        {formErrors.userRating && <p className="text-danger">{formErrors.userRating}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Feedback:</label>
                        <textarea
                            className="form-control"
                            name="userFeedback"
                            value={data.userFeedback}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-dark">
                        {editingMode ? "Update" : "Submit"}
                    </button>
                </form>
            </div>

            {/* Submitted Data Section */}
            <div className="submitted-data">
                <h2 className="mt-4" style={{ color: "#fff" }}>Submitted Data</h2>
                {savedEntries.length > 0 && (
                    <table className="table table-dark table-striped mt-2">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>

                                <th>Address</th>
                                <th>City</th>
                                <th>Rating</th>
                                <th>Feedback</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {savedEntries.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.fullName}</td>
                                    <td>{entry.userEmail}</td>

                                    <td>{entry.userAddress}</td>
                                    <td>{entry.userCity}</td>
                                    <td>{emojiRatings[entry.userRating - 1]}</td>
                                    <td>{entry.userFeedback}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(index)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(index)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default DarkThemeForm;
