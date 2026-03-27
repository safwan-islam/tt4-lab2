const Task = require("../models/Task");
const User = require("../models/User");


const resolveAssignedUserId = async (assignedUserId) => {
    if(!assignedUserId){
        return { value: null };
    }

    const user = await User.findById(assignedUserId);

    if(!user){
        return { error: "Assigned user not found" };
    }

    return { value: assignedUserId };
}

const createTask = async (req, res) => {
    try{
        if(!req.user || !req.user.id){
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { title, description, done, priority, assignedUserId } = req.body;

        if(!title){
            return res.status(400).json({ message: "Title is required" });
        }

        const resolved = await resolveAssignedUserId(assignedUserId);

        if(resolved.error){
            return res.status(400).json({ message: resolved.error });
        }

        const task = await Task.create({
            title,
            description,
            done,
            priority,
            userId: req.user.id,
            assignedUserId: resolved.value
        });

        return res.status(201).json({
            message: "Task created successfully",
            data: {
                task
            }
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Error while creating task" });
    }
}

const getTasks = async (req, res) => {
    try{
        if(!req.user || !req.user.id){
            return res.status(401).json({ message: "Unauthorized" });
        }

        const tasks = await Task.find({
            $or: [
                { userId: req.user.id },
                { assignedUserId: req.user.id }
            ]
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Tasks fetched successfully",
            data: {
                tasks
            }
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Error while fetching tasks" });
    }
}

module.exports = { createTask, getTasks };