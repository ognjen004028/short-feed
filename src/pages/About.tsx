import React from 'react';
import { Github, Twitter, Youtube } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-zinc-900 rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-6">About short-feed</h1>
        
        <div className="space-y-6">
          <p className="text-lg text-gray-300">
            <b>short-feed,</b> a YouTube Shorts clone created using React TypeScript.
          </p>
          
          <div className="border-t border-zinc-800 pt-6">
            <h2 className="text-2xl font-bold mb-4">Website Features</h2>
            <p className="text-gray-300">
              Search by keyword functionality is supported - just search and press Enter! <br></br>
              Load the next video by pressing the arrow button on the webpage. <br></br>
              Each video is displayed with its title, 
              description, and a link to the current YouTube video can be copied to clipboard 
              by pressing the Share button. <br></br>
              Users may register a new account, or log in to an existing one. <br></br>
              Once logged in, access your Profile page by clicking on your username on the top right of the page.
              Your search and view history will be available on your Profile page.
            </p>
          </div>
          
          <div className="border-t border-zinc-800 pt-6">
            <h2 className="text-2xl font-bold mb-4">Connect With Us</h2>
            <div className="flex space-x-6">
              {/* <a href="#" className="hover:text-red-500 flex items-center space-x-2">
                <Youtube className="w-6 h-6" />
                <span>YouTube</span>
              </a>
              <a href="#" className="hover:text-blue-400 flex items-center space-x-2">
                <Twitter className="w-6 h-6" />
                <span>Twitter</span>
              </a> */}
              <a href="https://github.com/ognjen004028/short-feed" className="hover:text-purple-500 flex items-center space-x-2">
                <Github className="w-6 h-6" />
                <span>short-feed @ github.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}