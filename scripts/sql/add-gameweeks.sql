
TRUNCATE TABLE gameweeks RESTART IDENTITY;

INSERT INTO gameweeks ("startDate")
SELECT date::date 
FROM generate_series(
  '2022-07-29'::date,
  '2023-05-05'::date,
  '1 week'::interval
) date;
