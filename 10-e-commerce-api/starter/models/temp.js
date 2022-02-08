const agg = [
	{
		$match: {
			product: new ObjectId("620295108fafc6b491188eeb"),
		},
	},
	{
		$group: {
			_id: null,
			averageRating: {
				$avg: "$rating",
			},
			numberOfReviews: {
				$sum: 1,
			},
		},
	},
];
