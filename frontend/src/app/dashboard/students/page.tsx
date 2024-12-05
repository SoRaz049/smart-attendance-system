"use client";
import React, { useEffect, useState } from "react";
import StudentCard from "./components/StudentCard";
import { FiFilter } from "react-icons/fi"; // Using react-icons for the filter icon
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { Student } from "@/types";
import { toast } from "react-toastify";

const StudentPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [fetching, setFetching] = useState(false);

  // const students = [
  //   {
  //     id: "267121",
  //     name: "Prukaj Shrestha",
  //     photoUrl:
  //       "https://images.pexels.com/photos/886285/pexels-photo-886285.jpeg?auto=compress&cs=tinysrgb&w=600",
  //     isPresent: true,
  //     course: "BSc. CSIT",
  //     batch: "2077",
  //     section: "A",
  //     email: "prukaj@college.edu.np",
  //   },
  //   {
  //     id: "267122",
  //     name: "Sneha Maharjan",
  //     photoUrl:
  //       "https://images.pexels.com/photos/6682475/pexels-photo-6682475.jpeg?auto=compress&cs=tinysrgb&w=600",
  //     isPresent: true,
  //     course: "BSc. CSIT",
  //     batch: "2077",
  //     section: "A",
  //     email: "sneha@college.edu.np",
  //   },
  //   {
  //     id: "267123",
  //     name: "Ramesh Karki",
  //     photoUrl:
  //       "https://images.pexels.com/photos/16105475/pexels-photo-16105475/free-photo-of-young-smiling-man.jpeg?auto=compress&cs=tinysrgb&w=600",
  //     isPresent: true,
  //     course: "BBA",
  //     batch: "2076",
  //     section: "B",
  //     email: "ramesh@college.edu.np",
  //   },
  //   {
  //     id: "267124",
  //     name: "Manisha Thapa",
  //     photoUrl:
  //       "https://images.pexels.com/photos/16160800/pexels-photo-16160800/free-photo-of-a-young-teenager-smiling.jpeg?auto=compress&cs=tinysrgb&w=600",
  //     isPresent: true,
  //     course: "BBA",
  //     batch: "2076",
  //     section: "B",
  //     email: "manisha@college.edu.np",
  //   },
  //   {
  //     id: "267125",
  //     name: "Sunil Maharjan",
  //     photoUrl:
  //       "https://images.pexels.com/photos/16160857/pexels-photo-16160857/free-photo-of-portrait-of-smiling-man.jpeg?auto=compress&cs=tinysrgb&w=600",
  //     isPresent: false,
  //     course: "BSc. CSIT",
  //     batch: "2077",
  //     section: "A",
  //     email: "sunil@college.edu.np",
  //   },
  //   {
  //     id: "267126",
  //     name: "Shruti Tamrakar",
  //     photoUrl:
  //       "https://images.pexels.com/photos/16160848/pexels-photo-16160848/free-photo-of-portrait-of-smiling-woman.jpeg?auto=compress&cs=tinysrgb&w=600",
  //     isPresent: true,
  //     course: "BSc. Nursing",
  //     batch: "2078",
  //     section: "C",
  //     email: "shruti@college.edu.np",
  //   },
  //   {
  //     id: "267127",
  //     name: "Anuj Khadka",
  //     photoUrl:
  //       "https://images.pexels.com/photos/8199679/pexels-photo-8199679.jpeg?auto=compress&cs=tinysrgb&w=600",
  //     isPresent: false,
  //     course: "BSc. Agriculture",
  //     batch: "2075",
  //     section: "D",
  //     email: "anuj@college.edu.np",
  //   },
  //   {
  //     id: "267128",
  //     name: "Sujata Shahi",
  //     photoUrl:
  //       "https://t3.ftcdn.net/jpg/03/24/23/94/360_F_324239419_2JP9AjFhRtQUNsb9Dw6l5rGpoX61y8MC.jpg",
  //     isPresent: true,
  //     course: "BBA",
  //     batch: "2076",
  //     section: "B",
  //     email: "sujata@college.edu.np",
  //   },
  //   {
  //     id: "267129",
  //     name: "Bibek Ghimire",
  //     photoUrl:
  //       "https://images.pexels.com/photos/845457/pexels-photo-845457.jpeg?auto=compress&cs=tinysrgb&w=600",
  //     isPresent: false,
  //     course: "BSc. CSIT",
  //     batch: "2077",
  //     section: "A",
  //     email: "bibek@college.edu.np",
  //   },
  //   {
  //     id: "267130",
  //     name: "Asmita Khatiwada",
  //     photoUrl:
  //       "https://images.pexels.com/photos/26871121/pexels-photo-26871121/free-photo-of-a-young-woman-wearing-a-graduation-gown-and-a-mortarboard.jpeg?auto=compress&cs=tinysrgb&w=600",
  //     isPresent: true,
  //     course: "BSc. Nursing",
  //     batch: "2078",
  //     section: "C",
  //     email: "asmita@college.edu.np",
  //   },
  // ];

  const fetchStudents = async () => {
    setFetching(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/student`
      );
      console.log(response);
      if (response.status === 200) {
        setStudents(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch students");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="">
      {/* Search and Filter Section */}
      <div className="flex items-center justify-between gap-2 w-full  mb-6">
        <div className="flex items-center gap-2 w-full">
          <Input
            type="text"
            placeholder="Search for students"
            className="border w-full border-gray-300 rounded-md px-4 py-2  "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="flex items-center border px-4 py-[5px] rounded-md hover:bg-blue-600 ">
            <FiFilter className="mr-2" size={18} /> {/* Filter Icon */}
            Filter
          </button>
        </div>

        <Link href="/dashboard/students/new">
          <Button className="bg-blue text-white hover:bg-blue/80">
            <Plus /> Add Student
          </Button>
        </Link>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {fetching ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          students.map((student) => (
            <StudentCard key={student._id} student={student} />
          ))
        )}
      </div>
    </div>
  );
};

export default StudentPage;
