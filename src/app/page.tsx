import React from 'react';
import { Metadata } from 'next';
import HomeClient from '../components/home/HomeClient';

export const metadata: Metadata = {
  title: 'Fly & Flourish Overseas | Study at Your Dream Destination',
  description: 'Elevate your global transitions with our ultra-precise 3D application profiling, direct Ivy League shorts, and direct-to-visa success records.',
};

export default function HomePage() {
  return <HomeClient />;
}
