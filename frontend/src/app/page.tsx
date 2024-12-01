import Image from "next/image";
import { Button } from "@/components/ui/button"; // Assuming you're using Shadcn buttons
import { User, UserCheck, UserCircle } from "lucide-react"; // Icons from Lucide or Shadcn
import HomeNav from "./components/HomeNav";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-h-screen max-w-full h-[80vh] ">
      <HomeNav />

      {/* Background Image */}
      <div className="absolute inset-0 -z-20">
        {/* <Image
          src="https://images.pexels.com/photos/8423051/pexels-photo-8423051.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Classroom background"
          fill
          className="object-cover"
          priority
        /> */}
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/90 via-white/70 to-white/10"></div>

      <div className="flex h-full flex-col items-center justify-center space-y-10 px-6">
        {/* <h1 className="text-5xl font-bold text-blue lg:text-7xl">
          Smart Attendance System
        </h1>

        <p className="max-w-2xl text-center text-lg text-gray-800">
          Experience seamless and efficient attendance tracking with facial
          recognition. Choose an option below to get started.
        </p> */}

        <div className=" flex justify-center w-full max-w-4xl gap-6 ">
          <div className="hover:scale-105 bg-opacity-70 duration-300 text-blue flex flex-col items-center space-y-4 rounded-lg bg-white p-6 shadow-lg transition hover:shadow-xl">
            <UserCheck className="h-20 w-20 text-blue-600" />
            <h2 className="text-xl text-blue font-semibold ">
              Start Attendance
            </h2>
            <p className="text-center text-sm text-gray-700">
              Begin facial recognition attendance for your class session.
            </p>
            <Link href="/attendance" className="w-full ">
              <Button
                variant="default"
                size="lg"
                className="w-full bg-blue hover:bg-blue/90"
              >
                Start Attendance
              </Button>
            </Link>
          </div>

          {/* <div className="hover:scale-105 text-blue bg-opacity-70 duration-300 flex flex-col items-center space-y-4 rounded-lg bg-white p-6 shadow-lg transition hover:shadow-xl">
            <UserCircle className="h-20 w-20 text-blue-600" />
            <h2 className="text-xl text-blue font-semibold ">
              Administrator Panel
            </h2>
            <p className="text-center text-sm text-gray-700">
              Access the admin panel to review and manage attendance records.
            </p>
            <Button
              variant="default"
              size="lg"
              className="w-full bg-blue hover:bg-blue/90"
            >
              Login
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
