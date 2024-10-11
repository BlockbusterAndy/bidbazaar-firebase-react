import React, { useState } from 'react';
import { Card, Label, TextInput, Textarea, Select, Button, ToggleSwitch, FileInput, Spinner, Alert } from 'flowbite-react';
import { createListingWithImages } from '../../utils/userUtils';
import Navbar from '../Navbar';

const CreateListing = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    category: '',
    startingPrice: '',
    endDate: '',
    endTime: '',
    hasAuthenticityDocument: false,
    images: [] // Store images locally before uploading
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = e.target.files; // Get the FileList
    const filesArray = Array.from(files); // Convert to Array

    setFormData(prevState => ({
      ...prevState,
      images: filesArray // Update state with the array of files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setSuccessMessage('');
    setErrorMessage('');

    // Validate starting price
    if (formData.startingPrice <= 0) {
      setErrorMessage("Starting price must be a positive number.");
      return;
    }

    // Ensure images are selected
    if (formData.images.length === 0) {
      setErrorMessage("Please upload at least one image.");
      return;
    }

    setIsLoading(true);

    try {
      // Use the utility function to create listing and upload images
      const result = await createListingWithImages(formData);
      setSuccessMessage('Listing created successfully.');
      setFormData({
        itemName: '',
        description: '',
        category: '',
        startingPrice: '',
        endDate: '',
        endTime: '',
        hasAuthenticityDocument: false,
        images: [] // Reset images
      }); // Reset form
      console.log(result.message);
    } catch (error) {
      setErrorMessage('Error creating listing: ' + error.message);
      console.error('Error creating listing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main className="max-w-2xl mx-auto p-4 py-6">
        <Card>
          <form onSubmit={handleSubmit}>
            {/* Form inputs */}
            <div className="mb-4">
              <Label htmlFor="itemName" value="Item Name" />
              <TextInput
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="description" value="Description" />
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="category" value="Category" />
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="collectibles">Collectibles</option>
              </Select>
            </div>

            <div className="mb-4">
              <Label htmlFor="startingPrice" value="Starting Price (₹)" />
              <TextInput
                id="startingPrice"
                name="startingPrice"
                type="number"
                value={formData.startingPrice}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="endDate" value="End Date" />
                <TextInput
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime" value="End Time" />
                <TextInput
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="uploadImages" value="Upload Images" />
              <FileInput
                id="uploadImages"
                name="uploadImages"
                onChange={handleImageChange}
                helperText="Upload one or more images of your item"
                multiple
                required
              />
            </div>

            {formData.images.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-2">Selected Images:</h3>
                <div className="flex space-x-2 overflow-x-auto">
                  {formData.images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)} // Create a URL for the image
                      alt={`Preview ${index + 1}`}
                      className="h-20 w-20 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <ToggleSwitch
                checked={formData.hasAuthenticityDocument}
                onChange={() => setFormData(prev => ({ ...prev, hasAuthenticityDocument: !prev.hasAuthenticityDocument }))} />
              <Label htmlFor="hasAuthenticityDocument">
                Item has authenticity document
              </Label>
            </div>

            {isLoading && (
              <div className="mb-4 text-center">
                <Spinner color="dark" />
              </div>
            )}

            {successMessage && (
              <Alert color="success">
                {successMessage}
              </Alert>
            )}

            {errorMessage && (
              <Alert color="failure">
                {errorMessage}
              </Alert>
            )}

            <Button type="submit" className="w-full" color='dark' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Add Item to Auction'}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CreateListing;