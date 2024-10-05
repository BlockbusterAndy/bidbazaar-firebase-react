import React, { useState } from 'react';
import { Card, Label, TextInput, Textarea, Select, Button, ToggleSwitch, FileInput } from 'flowbite-react';
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
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <div>
        <header>
            <Navbar />
        </header>
        <main className="max-w-2xl mx-auto p-4 py-6">
        <Card>
            <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4">Add Item to Auction</h2>
            <p className="mb-4 text-gray-500">Fill in the details of the item you want to auction.</p>
            
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
                {/* Add more categories as needed */}
                </Select>
            </div>

            <div className="mb-4">
                <Label htmlFor="startingPrice" value="Starting Price ($)" />
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
                helperText="Upload one or more images of your item"
                multiple
                />
            </div>

            <div className="flex items-center gap-2 mb-4">
                <ToggleSwitch
                checked={formData.hasAuthenticityDocument}
                onChange={() => setFormData(prev => ({ ...prev, hasAuthenticityDocument: !prev.hasAuthenticityDocument }))}
                />
                <Label htmlFor="hasAuthenticityDocument">
                Item has authenticity document
                </Label>
            </div>

            <Button type="submit" className="w-full">
                Add Item to Auction
            </Button>
            </form>
        </Card>
        </main>
    </div>
  );
};

export default CreateListing;