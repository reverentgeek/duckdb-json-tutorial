-- Query a JSON file directly
SELECT * FROM './ducks.json';

-- Query a more complex, nested JSON structure using UNNEST
SELECT unnest(ducks, recursive:= true) FROM './ducks-example.json';

-- Example of converting (casting) a column as a datetime
SELECT id, 
	CAST(sampleTime AS datetime) AS sampleTime, 
	action 
FROM './samples.json' LIMIT 10;

-- Alternative example of converting (casting) a column as a datetime
SELECT id, 
	sampleTime::DATETIME AS sampleTime, 
	action 
FROM './samples.json' LIMIT 10;

-- Example of specifying the schema of the JSON data 
-- to convert a string to datetime
-- Note, the other JSON properties are not part of the results, only
-- the columns specified in the read_json columns
SELECT date_part('day', sampleTime) AS sample_day,
	date_part('month', sampleTime) AS sample_month,
	date_part('year', sampleTime) AS sample_year,
	COUNT(*) AS samples_taken
FROM read_json('./samples.json', columns = { sampleTime: 'datetime' }) AS samples
GROUP BY ALL
ORDER BY 3, 2, 1;

SELECT CAST(samples.sampleTime AS date) AS sampleDate,
	ducks.firstName,
	ducks.lastName,
	samples.action
FROM    read_json('./samples.json', columns = { id: 'varchar', sampleTime: 'datetime', action: 'varchar' }) AS samples
JOIN    './ducks.json' AS ducks ON ducks.id = samples.id
ORDER BY 1 ASC
LIMIT 10;

CREATE OR REPLACE TABLE duck_samples AS
SELECT samples.id,
	CAST(samples.sampleTime AS date) AS sample_date,
	ducks.firstName || ' ' || ducks.lastName AS duck_name,
	samples.action,
	COUNT(*) AS observations
FROM    read_json('./samples.json', columns = { id: 'varchar', sampleTime: 'datetime', action: 'varchar' }) AS samples
JOIN    './ducks.json' AS ducks ON ducks.id = samples.id
GROUP BY ALL;

SELECT ds.sample_date, 
	ds.duck_name, 
	ds.action,
	ds.observations,
	-- totals.total_obs,
	round(( ds.observations / totals.total_obs ) * 100, 1) AS percent_total
FROM duck_samples AS ds
	JOIN ( SELECT id, sample_date, SUM(observations) AS total_obs FROM duck_samples GROUP BY ALL ) AS totals
	ON ds.id = totals.id AND ds.sample_date = totals.sample_date
WHERE ds.sample_date = '2024-01-01'
GROUP BY ALL
ORDER BY 5 DESC;

SELECT ds.sample_date, 
	ds.action,
	ds.observations,
	round(( ds.observations / totals.total_obs ) * 100, 1) AS percent_total
FROM ( SELECT sample_date, action, SUM(observations) AS observations FROM duck_samples GROUP BY ALL ) AS ds
	JOIN ( SELECT sample_date, SUM(observations) AS total_obs FROM duck_samples GROUP BY ALL ) AS totals
	ON ds.sample_date = totals.sample_date
WHERE ds.sample_date = '2024-01-01'
GROUP BY ALL
ORDER BY 3 DESC;

.exit
