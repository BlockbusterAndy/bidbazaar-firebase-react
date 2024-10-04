import React from 'react';
import Navbar from '../Navbar';
import { TextInput, Button } from 'flowbite-react';
import { IoIosSearch } from "react-icons/io";
import { LiaGavelSolid } from "react-icons/lia";
import { FaRegCreditCard } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none my-2">
                  Welcome to BidBazaar
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover unique items and bid on exciting auctions. Your next treasure is just a click away!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <TextInput className="max-w-lg flex-1" placeholder="Search for auctions" type="text" />
                  <Button type="submit" color="dark">
                    <IoIosSearch className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Featured Auctions
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    alt={`Featured Auction ${i}`}
                    className="object-cover w-full h-60"
                    height="300"
                    src={""}
                    style={{
                      aspectRatio: "400/300",
                      objectFit: "cover",
                    }}
                    width="400"
                  />
                  <div className="bg-white p-4 dark:bg-gray-950">
                    <h3 className="font-semibold text-lg mb-2">Vintage Watch Collection</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Bid: $1,200</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ends in: 2d 5h 30m</p>
                  </div>
                  <Link
                    className="absolute inset-0 focus:z-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
                    to="#"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              How It Works
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <IoIosSearch className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Find Your Item</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Browse through our wide selection of unique items up for auction.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <LiaGavelSolid className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Place Your Bid</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Set your maximum bid and let our system automatically bid for you.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <FaRegCreditCard className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Win & Pay</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  If you win, securely pay for your item and arrange for delivery or pickup.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Start Bidding?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join BidBazaar today and discover amazing deals on unique items.
                </p>
              </div>
              <div className="space-x-4 flex flex-row">
                <Link to="/register" >
                  <Button color="dark">Sign Up Now</Button>
                </Link>
                <Button color="light">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
