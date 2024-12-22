import express from 'express';
import asyncHandler from 'express-async-handler';
import movieModel from './movieModel';
import { getUpcomingMovies, getGenres } from '../tmdb-api';  // 导入获取电影流派的函数

const router = express.Router();

// 获取所有电影
router.get('/', asyncHandler(async (req, res) => {
    let { page = 1, limit = 10 } = req.query; // destructure page and limit and set default values
    [page, limit] = [+page, +limit]; // trick to convert to numeric (req.query will contain string values)

    // Parallel execution of counting movies and getting movies using movieModel
    const [total_results, results] = await Promise.all([
        movieModel.estimatedDocumentCount(),
        movieModel.find().limit(limit).skip((page - 1) * limit)
    ]);
    const total_pages = Math.ceil(total_results / limit); // Calculate total number of pages (= total No Docs/Number of docs per page)

    // Construct return Object and insert into response object
    const returnObject = {
        page,
        total_pages,
        total_results,
        results
    };
    res.status(200).json(returnObject);
}));

// 获取电影详情
router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const movie = await movieModel.findByMovieDBId(id);
    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).json({ message: 'The movie you requested could not be found.', status_code: 404 });
    }
}));

// 获取即将上映的电影
router.get('/tmdb/upcoming', asyncHandler(async (req, res) => {
    const upcomingMovies = await getUpcomingMovies();
    res.status(200).json(upcomingMovies);
}));

// 获取电影流派
router.get('/genres', asyncHandler(async (req, res) => {
    try {
        const genres = await getGenres();  // 获取流派数据
        res.status(200).json({ genres });  // 返回流派数据
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch genres', error: error.message });
    }
}));

export default router;
