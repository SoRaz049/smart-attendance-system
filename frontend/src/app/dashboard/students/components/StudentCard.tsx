import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StudentCard({ student }: { student: any }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          {student.isPresent ? (
            <Badge className="bg-blue hover:bg-blue/80">Present</Badge>
          ) : (
            <Badge className="bg-red-500 hover:bg-red-500/80">Absent</Badge>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col items-center space-y-3 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={student.photoUrl}
              alt="Student"
              className="object-cover"
            />
            <AvatarFallback>ST</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-semibold">{student.name}</h2>
            <p className="text-sm text-muted-foreground">{student.course}</p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-12">Id: </span>
            <span className="text-muted-foreground">{student.idNumber}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="w-12">Email: </span>{" "}
            <span className="text-muted-foreground">{student.email}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="w-12">Batch: </span>{" "}
            <span className="text-muted-foreground">{student.batch}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-12"> Section: </span>{" "}
            <span className="text-muted-foreground">{student.section}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end text-sm text-muted-foreground px-4 pb-2">
        {/* <span>Enrolled on 15 Sep, 2023</span> */}
        <Link href={`/dashboard/students/${student._id}`}>
          <Button variant="link" className="text-blue p-0 text-xs">
            View details →
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
