import React, {useEffect, useState} from 'react';
import { Carousel, TextInput, Button, Card, Avatar } from 'flowbite-react';
import { LuCheckCircle } from "react-icons/lu";
import Navbar from '../Navbar';
import ListingCard from '../ListingCard';
import CardLayout from '../CardLayout';
import { IoMdTime } from "react-icons/io";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Listing = () => {
    const [currentBid, setCurrentBid] = useState(0);
    const [bidAmount, setBidAmount] = useState(0);
    const [activeTab, setActiveTab] = useState("bidHistory");

    const handleOnChange = (e) => {
        setBidAmount(Number(e.target.value));  // Convert the input value to a number
        console.log(bidAmount);
    }    

    const placeBid = () => {
        setCurrentBid(currentBid + bidAmount);
        console.log('Bid placed:', bidAmount);
    }

    useEffect(() => {
        setCurrentBid(200);
    }, []);

    useEffect(() => {
        console.log('currentBid:', currentBid);
    }, [currentBid]);

    useGSAP( () => {
        gsap.fromTo('#currentBidPrice', {opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1 , ease: 'power2.out'});
    },[currentBid]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'bidHistory':
                return (
                <div className='flex flex-col'>
                    <div>
                        <h2 className='text-2xl font-semibold'>Bid History</h2>
                    </div>
                    <div className='mt-6'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-row justify-between items-center'>
                                <div className='flex items-center gap-4'>
                                    <Avatar size='md' src='https://via.placeholder.com/150' rounded />
                                    <p className='font-medium text-lg'>Display Name</p>
                                </div>
                                <div>
                                    <p className='tracking-wide font-semibold '>₹200</p>
                                    <span className='text-slate-500'>2 Hours ago</span>
                                </div>
                            </div>
                            <hr class="border-1 mt-1"></hr>
                        </div>
                    </div>
                </div>
            );
            case 'comments':
                return (
                <div className='flex flex-col'>
                    <div>
                        <h2 className='text-2xl font-semibold'>Comments</h2>
                    </div>
                    <div className='mt-4'>
                        <div className='flex flex-col gap-2 mt-2'>
                            <div className='flex flex-row justify-between items-center'>
                                <div className='flex items-center gap-4'>
                                    <Avatar size='sm' src='https://via.placeholder.com/150' rounded />
                                    <p className='font-medium text-base'>Display Name</p>
                                </div>
                                <div>
                                    <span className='text-slate-500'>2 Hours ago</span>
                                </div>
                            </div>
                            <div>
                                <p className='text-lg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quia.</p>
                            </div>
                            <hr class="border-1 mt-1"></hr>
                        </div>
                    </div>
                </div>
                
            );
            default:
                return null;
        }
    };

    return (
        <div>
            <header>
                <Navbar />
            </header>
            <main className='px-[5vw] pt-[5vw]'>
                <div className="grid grid-cols-2 grid-rows-5 gap-y-4 gap-x-6 max-h-[75vh]">

                    <div className="row-span-3 h-[45vh] relative">
                        <Carousel className='h-full'>
                            <img src="https://via.placeholder.com/500" alt="placeholder" />
                            <img src="https://via.placeholder.com/500" alt="placeholder" />
                            <img src="https://via.placeholder.com/500" alt="placeholder" />
                        </Carousel>
                        <div className='authentic-checkmark flex flex-row items-center justify-center gap-2 absolute right-2 top-2 z-50 px-3 py-2 bg-lime-600 rounded-full opacity-90'>
                            <LuCheckCircle size={15} className='text-white' /> <span className='text-sm font-medium text-white'>Authentic</span>
                        </div>
                    </div>

                    <div className="row-span-2 col-start-1 row-start-4">
                        <ListingCard itemName={'Vintage leica M3 Camera'} itemCategory={'Cameras'} itemDescription={'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum quae assumenda consequatur odit ad qui inventore, odio sit quibusdam harum nam exercitationem! Ab officiis natus blanditiis numquam nobis, omnis sint.'} />
                    </div>

                    <div className="row-span-2 col-start-2 row-start-1 ">
                        <Card className='h-full p-6'>
                            <div className='flex flex-row justify-between py-4'>
                                <h2 className='text-2xl font-semibold' >Current Bid:{" "}<span id='currentBidPrice' className=' tracking-wider' >₹{currentBid}</span></h2>
                                <span className='flex flex-row gap-2 items-center font-medium text-slate-900 rounded-full shadow-md py-2 px-3 border border-slate-300'><IoMdTime size={25}/>{" "}1d 23h 59m 57s</span>
                            </div>
                            <div className='flex flex-row gap-2 w-full py-4'>
                                <TextInput type='number' placeholder='Your bid amount' className='w-[85%]' name='bidAmount' onChange={handleOnChange} />
                                <Button type='submit' color='dark' onClick={()=>{placeBid()}} >Place Bid</Button>
                            </div>
                        </Card>
                    </div>

                    <div className="row-span-3 col-start-2 row-start-3">
                        <CardLayout>
                            <div className='bg-slate-200 rounded-lg w-full flex flex-row gap-2 p-1 text-center mb-2'>
                                <span 
                                    className={`w-1/2 rounded-lg py-2 font-medium cursor-pointer ${activeTab === 'bidHistory' ? 'bg-white shadow-md font-semibold' : ''}`} 
                                    onClick={() => setActiveTab('bidHistory')}
                                >
                                    Bid History
                                </span>
                                <span 
                                    className={`w-1/2 rounded-lg py-2 font-medium cursor-pointer ${activeTab === 'comments' ? 'bg-white shadow-md font-semibold' : ''}`} 
                                    onClick={() => setActiveTab('comments')}
                                >
                                    Comments
                                </span>
                            </div>
                            <div>
                                {renderTabContent()}
                            </div>
                        </CardLayout>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Listing;
