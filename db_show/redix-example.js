const TENDER_DEFAULT_EXPIRATION = 5000;

const redisClient = createClient({ url: process.env.REDIS_URL });

export const getTenders = catchAsync(async (req, res) => {
    const params  = makeRedisParams(req.params);

    redisClient.get(`tenders-${params}`, async (error, savedTenders) => {
        if (error) throw new ApiError(EHttpStatusCodes.BAD_REQUEST, 'Something went wrong');

        if (savedTenders != null) {
            return res.status(EHttpStatusCodes.OK).json({
                status: 'success',
                data: {
                    tenders: JSON.parse(savedTenders),
                },
            });
        };

        const features = new MongooseApiService(Tender.find(), req.query).filter().getTotal().sort().limitFields().paginate();

        const tenders = await features.query;
        res.status(EHttpStatusCodes.OK).json({
            status: 'success',
            data: {
                tenders,
            },
        });

        redisClient.setEx(`tenders-${params}`, TENDER_DEFAULT_EXPIRATION, tenders)
    });
});