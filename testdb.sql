
\c nc_games_test

      -- SELECT reviews.*,COUNT(comment_id) AS comment_count
      -- FROM reviews
      -- LEFT JOIN comments ON comments.review_id = reviews.review_id
      -- WHERE reviews.review_id = 3
      -- GROUP BY reviews.review_id;



    -- SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer,  COUNT(comment_id) AS comment_count
    --   FROM reviews
    --   LEFT JOIN comments ON comments.review_id = reviews.review_id
    --   GROUP BY reviews.review_id;



    -- old sql entry 
    --    SELECT reviews.*,  COUNT(comment_id) AS comment_count
    --   FROM reviews
    --   LEFT JOIN comments ON comments.review_id = reviews.review_id
    --   GROUP BY reviews.review_id;