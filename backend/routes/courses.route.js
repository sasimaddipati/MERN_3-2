const express = require("express");
const courseModel = require("../models/courses.model");
const { auth } = require("../middlewares/users.middleware");
const { UserModel } = require("../models/users.models.js");

const courseRoute = express.Router();




courseRoute.get("/all", async (req, res) => {
  try {
    let { q, sortBy, sortOrder, page, limit } = req.query;
    let filter = {};
    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }
    page = page ? page : 1;
    limit = limit ? limit : 10;
    // console.log(filter,sort)
    const data = req.body;
    const course = await courseModel
      .find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({ course });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something Went Wrong", error: err.message });
  }
});





courseRoute.use(auth);

courseRoute.get("/", async (req, res) => {
  try {
    let { q, sortBy, sortOrder, page, limit } = req.query;
    let filter = {};
    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }
    page = page ? page : 1;
    limit = limit ? limit : 10;
    // console.log(filter,sort)
    const data = req.body;
    const course = await courseModel
      .find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({ course });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something Went Wrong", error: err.message });
  }
});

courseRoute.get("/TeacherCourses", async (req, res) => {
  try {
    let { userId } = req.query;
    let filter = {};
    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }
    // Add filter for userId
    if (userId) {
      filter.teacherId = userId;
    }
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const data = req.body;
    const course = await courseModel
      .find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({ course });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something Went Wrong", error: err.message });
  }
});
courseRoute.get("/:courseID", async (req, res) => {
  try {
    const courseID = req.params.courseID;
    console.log(courseID)
    const course = await courseModel.findOne({ _id: courseID });
    res.status(200).json({ course });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something Went Wrong", error: err.message });
  }
});
courseRoute.post("/add", async (req, res) => {
  try {
    if (req.body.role == "admin" || req.body.role == "teacher") {
      const { title, teacher } = req.body;
      const course = await courseModel.find({ title, teacher });
      //console.log(course)
      if (course.length) {
        res.status(403).json({ message: "Course Already Present" });
      } else {
        let data = req.body
        const newCourse = new courseModel({...data,teacher:req.body.username,teacherId:req.body.userId});
        await newCourse.save();
        res.status(201).json({ message: "Course Added", data: newCourse });
      }
    } else {
      res.status(401).json({ error: "you don't have access to add course" });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something Went Wrong", error: err.message });
  }
});
courseRoute.patch("/update/:courseID", async (req, res) => {
  try {
    if (req.body.role == "admin" || req.body.role == "teacher") {
      const courseID = req.params.courseID;
      const course = await courseModel.findByIdAndUpdate(
        { _id: courseID },
        req.body
      );
      if (!course) {
        res.status(404).json({ message: "course not found" });
      } else {
        res.status(202).json({ message: "course updated", course });
      }
    } else {
      res.status(401).json({ error: "you don't have access to update course" });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something Went Wrong", error: err.message });
  }
});
courseRoute.delete("/delete/:courseID", async (req, res) => {
  try {
    if (req.body.role == "admin" || req.body.role == "teacher") {
      const courseID = req.params.courseID;
      const course = await courseModel.findByIdAndDelete({ _id: courseID });
     // console.log(course);
      if (!course) {
        res.status(404).json({ message: "course not found" });
      } else {
        res.status(200).json({ message: "course deleted", course });
      }
    } else {
      res
        .status(401)
        .json({ error: "you don't have access to delete the course" });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something Went Wrong", error: err.message });
  }
});

module.exports = { courseRoute };
