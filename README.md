# Covidarea
Report location of potentially infected people.

https://devpost.com/software/covidarea

# Preview
https://www.youtube.com/watch?v=IBD02-KOkdI&feature=emb_title

# Inspiration

These days, everyone is struggling to find safe paths in his local area in order to avoid potentially infected places.

# What it does
This map provides very nice, user friendly interface which shows locations of potentially infected people, reported by users of this application. Features:

user needs to do long press on some location in order to report it
user can't report location which isn't in certain radius of his current location
user can't submit more than 3 locations
every location will be automatically removed after 15 days
every user can remove any location as fake location. Doing that, user who reported that location won't be able to report locations again
How we built it
We are a team of 3 people, which consists of 2 mobile iOS developers and 1 PHP backend developer. For this application we used React Native with google maps for developing mobile app for iOS and Android, and Laravel with Redis for our API endpoints. We store locations in Redis using its GEO feature where you can really fast store and find near locations on the map.

# Challenges we ran into
Challenges were to find and implement the best database storage for billion of locations and to make a system which will rely on privacy and valid data.

# Accomplishments that I'm proud of
We are proud that we managed to investigate and create this application for 5 days beside our current jobs.

# What we learned
We've learned how to determine radius from the current location depending on zoom of the map, and how to return reduced number of locations also depending on the zoom of the map

# What's next for covidarea
We plan to optimise application to work smoothly as well as add new features such as analytics, spam prevention, notifications about near infected areas...

# Backend
https://gitlab.com/markomilivojevic/covid
