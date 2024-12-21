import express from 'express';
import { tasksData } from './tasksData';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// 获取所有任务
router.get('/', (req, res) => {
    res.json(tasksData);
});

// 获取特定任务详情
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const task = tasksData.tasks.find(task => task.id === id);
    if (!task) {
        return res.status(404).json({ status: 404, message: 'Task not found' });
    }
    return res.status(200).json(task);
});

// 添加新任务
router.post('/', (req, res) => {
    const { title, description, deadline, priority, done } = req.body;

    if (!title || !description) {
        return res.status(400).json({ status: 400, message: 'Title and description are required' });
    }

    const newTask = {
        id: uuidv4(),
        title,
        description,
        deadline,
        priority,
        done: done || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    tasksData.tasks.push(newTask);
    res.status(201).json(newTask);
    tasksData.total_results++;
});

// 更新现有任务
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasksData.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ status: 404, message: 'Task not found' });
    }

    const updatedTask = {
        ...tasksData.tasks[taskIndex],
        ...req.body,
        id: id,
        updated_at: new Date().toISOString(), // 更新修改时间
    };

    tasksData.tasks[taskIndex] = updatedTask;
    res.json(updatedTask);
});

// 删除任务
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasksData.tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ status: 404, message: 'Task not found' });
    }

    tasksData.tasks.splice(taskIndex, 1);
    res.status(204).send();
    tasksData.total_results--;
});

export default router;
