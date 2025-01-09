import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "./css/Setting.css";
import ImagePreviewSection from "./ImagePreviewSection";


const Setting = () => {
  const [settingData, setSettingData] = useState({
    museumName: "",
    logo: null,
    images: [],
    ticketPrice: "",
    availableTickets: "",
    description: "",
    iframe:"",
    category:""
  });
  const [initialData, setInitialData] = useState({});
  const [editFields, setEditFields] = useState({
    museumName: false,
    timing:false,
    logo: false,
    images: false,
    ticketPrice: false,
    availableTickets: false,
    description: false,
    iframe:false,
    category:false
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isFormModified, setIsFormModified] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/agency/get-setting-detail`, {
          withCredentials: true,
        });
        const data = response.data;
        setSettingData({
          museumName: data.requiredFields.MonumentName || "",
          category:data.requiredFields.category || "",
          timing:data.requiredFields.timing || "",
          logo: null,
          images: [],
          ticketPrice: data.requiredFields.ticketPrice || "",
          availableTickets: data.requiredFields.totalAvailableTicket || "",
          description: data.requiredFields.desc || "",
          iframe:data.requiredFields.iframe || ""
        });
        setInitialData(data.requiredFields);
        setLogoPreview(data.requiredFields.MonumentLogo || null);
        setImagePreviews(data.requiredFields.imageUrl || []);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "logo") {
      const logoFile = files[0];
      setSettingData({ ...settingData, logo: logoFile });
      setLogoPreview(URL.createObjectURL(logoFile));
    } else if (name === "images") {
      const selectedFiles = Array.from(files).slice(0, 5);
      setSettingData({ ...settingData, images: selectedFiles });
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    } else {
      setSettingData({ ...settingData, [name]: value });
    }

    setIsFormModified(true);
  };

  const toggleEdit = (field) => {
    console.log(field)
    setEditFields((prevState) => ({ ...prevState, [field]: !prevState[field] }));
  };

  useEffect(()=>{
      console.log(editFields.iframe)
  },[editFields])

  const validateFields = () => {
    const formErrors = {};
    if (!settingData.museumName.trim()) formErrors.museumName = "Museum Name is required";
    if (!settingData.category.trim()) formErrors.category = "Category is required";
    if (!settingData.timing.trim()) formErrors.timing = "Timing is required";
    if (!settingData.logo && !initialData.MonumentLogo) formErrors.logo = "Logo is required";
    if (
      settingData.images.length < 3 &&
      (!initialData.imageUrl || initialData.imageUrl.length < 3)
    )
      formErrors.images = "Minimum 3 images are required";
    if (isNaN(settingData.ticketPrice) || settingData.ticketPrice <= 0)
      formErrors.ticketPrice = "Valid Ticket Price is required";
    if (isNaN(settingData.availableTickets) || settingData.availableTickets <= 0)
      formErrors.availableTickets = "Valid number of Available Tickets is required";
    if (!settingData.description.trim())
      formErrors.description = "Description is required";
    if (!settingData.iframe.trim()) formErrors.iframe = "iframe src is required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async () => {
    // e.preventDefault();

    if (!validateFields()) return;
  
    const formData = new FormData();
  
    // // Only append fields that are modified by the user
    if (settingData.museumName !== initialData.MonumentName) {
      formData.append("museumName", settingData.museumName);
    }
    if (settingData.category !== initialData.category) {
      formData.append("category", settingData.category);
    }
    if (settingData.timing !== initialData.timing) {
      formData.append("timing", settingData.timing);
    }
    if (settingData.logo && settingData.logo !== initialData.MonumentLogo) {
      formData.append("logo", settingData.logo);
    }
    if (settingData.images.length > 0 && settingData.images !== initialData.imageUrl) {
     
        // formData.append(`images`, settingData.images);
        settingData.images.forEach((file) => formData.append('images', file));
    }
    if (settingData.ticketPrice !== initialData.ticketPrice) {
      formData.append("ticketPrice", settingData.ticketPrice);
    }
    if (settingData.availableTickets !== initialData.totalAvailableTicket) {
      formData.append("availableTickets", settingData.availableTickets);
    }
    if (settingData.description !== initialData.desc) {
      formData.append("description", settingData.description);
    }
    if (settingData.iframe !== initialData.iframe) {
      formData.append("iframe", settingData.iframe);
    }
  console.log(settingData.images)


    // const updatedData = {};

    // if (settingData.museumName !== initialData.MonumentName) {
    //   updatedData.museumName = settingData.museumName;
    // }
    // if (settingData.logo && settingData.logo !== initialData.MonumentLogo) {
    //   updatedData.logo = settingData.logo;
    // }
    // if (settingData.images.length > 0 && settingData.images !== initialData.imageUrl) {
    //   updatedData.images = settingData.images;
    // }
    // if (settingData.ticketPrice !== initialData.ticketPrice) {
    //   updatedData.ticketPrice = settingData.ticketPrice;
    // }
    // if (settingData.availableTickets !== initialData.totalAvailableTicket) {
    //   updatedData.availableTickets = settingData.availableTickets;
    // }
    // if (settingData.description !== initialData.desc) {
    //   updatedData.description = settingData.description;
    // }

    // console.log(updatedData,"updated")
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/agency/setting`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      console.log(response)
      alert("Settings Updated Successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      // alert("Failed to update settings.");
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="setting-container">
      <h1>Manage Museum Settings</h1>
      <div  className="setting-form"  >
        {/* Museum Name */}
        <div className="setting-form-group">
          <label>
            Museum Name
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="edit-icon"
              onClick={() => toggleEdit("museumName")}
            />
          </label>
          <input
            type="text"
            value={settingData.museumName}
            onChange={handleChange}
            disabled={!editFields.museumName}
            name="museumName"
            className="input-field"
          />
          {errors.museumName && <span className="error-text">{errors.museumName}</span>}
        </div>


        {/* Timing */}
        <div className="setting-form-group">
          <label>
            Timing
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="edit-icon"
              onClick={() => toggleEdit("timing")}
            />
          </label>
          <input
            type="string"
            name="timing"
            value={settingData.timing}
            onChange={handleChange}
            disabled={!editFields.timing}
            className="input-field"
            placeholder="e.g. from : 6:00 A.M. - 18:00 P.M."
          />
          {errors.timing && <span className="error-text">{errors.timing}</span>}
        </div>

        {/* Logo */}
        <div className="setting-form-group" style={{flexBasis:logoPreview?'unset':''}}>
         
          {logoPreview ? (
            <>
            <label>
            Logo
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="edit-icon"
              onClick={() => toggleEdit("logo")}
            />
          </label>
            <img src={logoPreview} alt="Logo Preview" className="logo-preview" />
            </>
          ) : (
            <div className="span-inp-empt-Outer-Cont">
            <label>
            Logo
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="edit-icon"
              onClick={() => toggleEdit("logo")}
            />
          </label>
            <span className="span-inp-empt">No logo uploaded</span>
            </div>
          )}
          <input
            type="file"
            name="logo"
            onChange={handleChange}
            disabled={!editFields.logo}
            className="input-field"
          />
          {errors.logo && <span className="error-text">{errors.logo}</span>}
        </div>

        {/* Images */}
        <div className="setting-form-group" style={{flexBasis:(imagePreviews && imagePreviews.length > 0) ?'unset':''}}>
          {/* <label>
            Images
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="edit-icon"
              onClick={() => toggleEdit("images")}
            />
          </label> */}
          {Array.isArray(imagePreviews) && imagePreviews.length > 0 ? ( 
            <>
            <label>
            Images
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="edit-icon"
              onClick={() => toggleEdit("images")}
            />
          </label>
            
            <div className="image-preview-container">
  
       {/* {imagePreviews.map((preview, index) => (
      <img key={index} src={preview} alt={`Preview ${index + 1}`} className="image-preview" />
    ))} */}
    <ImagePreviewSection imagePreviews={imagePreviews} />
    </div>
    </>
    )
  : (
    <div className="span-inp-empt-Outer-Cont">
    <label>
            Images
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="edit-icon"
              onClick={() => toggleEdit("images")}
            />
          </label>
    <span className="span-inp-empt">No images uploaded</span>
    </div>
  )}


          <input
            type="file"
            name="images"
            onChange={handleChange}
            multiple
            disabled={!editFields.images}
            className="input-field"
          />
          {errors.images && <span className="error-text">{errors.images}</span>}
        </div>

        {/* Ticket Price */}
        <div className="setting-form-group">
          <label>
            Ticket Price
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="edit-icon"
              onClick={() => toggleEdit("ticketPrice")}
            />
          </label>
          <input
            type="number"
            name="ticketPrice"
            value={settingData.ticketPrice}
            onChange={handleChange}
            disabled={!editFields.ticketPrice}
            className="input-field"
          />
          {errors.ticketPrice && <span className="error-text">{errors.ticketPrice}</span>}
        </div>

        {/* Available Tickets */}
        <div className="setting-form-group">
          <label>
            Available Tickets
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="edit-icon"
              onClick={() => toggleEdit("availableTickets")}
            />
          </label>
          <input
            type="number"
            name="availableTickets"
            value={settingData.availableTickets}
            onChange={handleChange}
            disabled={!editFields.availableTickets}
            className="input-field"
          />
          {errors.availableTickets && <span className="error-text">{errors.availableTickets}</span>}
        </div>


         {/* category */}
         <div className="setting-form-group">
          <label>
            Category
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="edit-icon"
              onClick={() => toggleEdit("category")}
            />
          </label>
          <input
            type="text"
            value={settingData.category}
            onChange={handleChange}
            disabled={!editFields.category}
            name="category"
            className="input-field"
          />
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        {/* Description */}
        <div className="event-creation-form-group full-width">
          <label>
            Description
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="edit-icon"
              onClick={() => toggleEdit("description")}
            />
          </label>
          <textarea
            name="description"
            value={settingData.description}
            onChange={handleChange}
            disabled={!editFields.description}
            className="input-field"
            
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="setting-form-group">
        
          <label>
            iframe src
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="edit-icon"
              onClick={() => toggleEdit("iframe")}
            />
          </label>
          {/* {
            settingData.iframe && settingData.iframe!==''    && <iframe
                        src={settingData.iframe}
                        width="100%"
                        height="323"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Map of Goa"
                      ></iframe>
          } */}
          <input
            type="text"
            value={settingData.iframe}
            onChange={handleChange}
            disabled={!editFields.iframe}
            
            name="iframe"
            className="input-field"
            placeholder="https://src"
          />
          {errors.museumName && <span className="error-text">{errors.iframe}</span>}
        </div>

        {/* Submit Button */}
        <button type="submit" onClick={handleSubmit} className="submit-button" disabled={!isFormModified} >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Setting;
