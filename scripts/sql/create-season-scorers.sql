SELECT p."playerId"
      ,position
      ,COALESCE("firstName",'') "firstName"
      ,COALESCE("lastName",'') "lastName"
      ,t.name team
	  ,t.alias
	  ,l.name division
	  ,g.goals
INTO public."seasonScorers"
FROM public.players p
INNER JOIN 
(SELECT "playerId", COUNT("playerId") goals
FROM public.goals g
WHERE cup = false
GROUP BY "playerId"
) g
ON p."playerId" = g."playerId"
INNER JOIN public.teams t
ON p."teamId" = t."teamId"
INNER JOIN public.divisions l
ON t."divisionId" = l."divisionId"
ORDER BY p.position,
goals DESC,
p."lastName",
p."firstName",
t.name
