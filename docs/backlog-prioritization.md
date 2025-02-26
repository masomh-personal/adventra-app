Backlog Prioritization Order:

Create entities / ERD:
Before we can start on system design we have to clearly define each of our entities
and determine how they will interact with one another.

Create UML diagram:
Once our entities are decided upon we can begin desiging our systems architecture.
It is important to do this early so we may have a strong foundation to work from.

Design database:
Before we create our database we must design it so that we do not run into
problems that force us to make design changes later on.

Design header / footer and our standard page layout:
By starting on these elements early we can quickly decide upon a common design scheme for
all of our webpages. This will save us work later on.

Create homepage:
Prioritizing our homepage is important. This will be the first things users see and is the
logical place to start.

Create, create profile page:
Setting up the layout of our registration page is also very important. We need it to be
easy to naviagate and use. Prioritizing this page second makes the most sense.

Implement create profile functionality:
Implementing this functionality will take a little time. Setting this page up to make database
queries make prove to take some time. We can also reuse soem code from this section so it is
worth doing early.

Create user login page:
Once account creation is implemented pivoting to login is a natural next step. Stylistically
we can set up this page similar to our accoutn creation page for readability

Implement login functionality:
Once the login page is finished the next most important thing is to get the login page functional.
We should be able to reuse or rework some of the queries we used for account creation which will
help save time.

Create matching Page:
Once users can register and login the next most important fucntion is to match with other users.
The layout of this page is important since users will spend a lot of time on this page.

Implement matching functionality:
This will be one of the most time entensive itmes on this list. Now that all the pre-requsite
pages are created we will need to devote a lot of time to implementing our profile matching
functionality.

Create messaging Page:
Once users are able to match they will need to be able to message one another to plan
"Adventures" with one another.

Implement messaging functionality:
Once the messaging pager is up we must implement the messaging functionality. Much like
before we should be able to reuse or rework previous queries for the function.

Create manage profile page:
The manage profile page and functionality should be starightforward. We can reuse the account
create page and use update queries to update profiles in the database.

Connect profiles to social media:
Allowing users to insert links to social media usign queries to the database will be easy.
We can add this to the manage profile page.

Implement user reporting and blocking:
Allowing users to report or block other users will require us to create way to store these requests
similar to how messages will be stored in the database.

Implement user status and availability indicator:
We can add an option to the profile page that lets you toggle availabillity. This will be
quick to implement.
