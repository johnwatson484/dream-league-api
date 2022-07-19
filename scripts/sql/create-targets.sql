SELECT ls."firstName" "First Name"
      ,ls."lastName" "Last Name"
      ,ls."position" "Previous Position"
	  ,p."position" "Current Position"
      ,ls."team" "Previous Team"
	  ,t.name "Current Team"
      ,ls."division" "Previous Division"
	  ,l.name "Current Division"
      ,"goals" "Goals"
  FROM public."seasonScorers" ls
  INNER JOIN public.players p
  ON ls."firstName" = p."firstName"
  AND ls."lastName" = p."lastName"
  INNER JOIN public.teams t
  ON p."teamId" = t."teamId"
  INNER JOIN public.divisions l
  ON t."divisionId" = l."divisionId"
  ORDER BY p.position,
Goals DESC,
ls."lastName",
ls."firstName",
t.name
