"use client";
import { useEffect, useState } from "react";
import AttendanceGrid from "@/app/components/Grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentDetails } from "../../../../../../types/types";
import { toast } from "react-toastify";
import axios from "axios";

export default function Component({
  params,
}: {
  params: { studentId: string };
}) {
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/student/${params.studentId}`
        );
        if (response.status === 200) {
          setStudent(response.data);
          console.log(response.data);
        } else if (response.status === 404) {
          toast.error("Student not found");
        }
      } catch (err: any) {
        console.error("Error fetching student data:", err);
        toast.error("Failed to load student details");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [params.studentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {student && (
        <>
          <Card className="w-full mx-auto">
            <CardHeader>
              <CardTitle>Student Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-shrink-0">
                  <Avatar className="w-44 h-44 my-auto">
                    <AvatarImage
                      src={student.photoUrl}
                      alt={student.name}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs mt-4">Today's Attendance:</p>
                  <p className="text-white w-fit text-xs bg-green px-2 rounded-full mt-1">
                    Present
                  </p>
                </div>
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Name</h3>
                    <p>{student.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">ID Number</h3>
                    <p>{student.idNumber}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <h3 className="font-semibold">Address</h3>
                    <p>{student.address}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Date of Birth</h3>
                    <p>{student.dateOfBirth}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Course</h3>
                    <p>{student.courseRef.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Batch</h3>
                    <p>{student.batch}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Section</h3>
                    <p>{student.section}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Contact No.</h3>
                    <p>{student.contactNo}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Guardian's Name</h3>
                    <p>{student.guardianName}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Guardian's Contact</h3>
                    <p>{student.guardianContact}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-4 absolute">
            <CardHeader>
              <CardTitle>Attendance Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceGrid />
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
