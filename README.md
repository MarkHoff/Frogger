Frogger
===============================

Students should use this rubric: https://www.udacity.com/course/viewer#!/c-ud015/l-3072058665/m-3072588797

for self-checking their submission.

This Frogger game is written using Object Oriented JavaScript.  Thanks to Anjali Nanda, whose project I cloned to give me a starting point.  I modified the *.js and index.html files to make the game behave according to my specifications.

After going through the lessons on Object Oriented JavaScript and creating the Canvas, I used outside references to solve problems I ran into while building the game.  For the most part, I used the http://www.w3schools.com/ website for straightforward questions I had about how JavaScript works.  For more complicated problems, http://www.stackoverflow.com is a useful resource.  I found that most problems I experienced were experienced by someone else along the way.

The Frogger game involves one Player entity, a number of Enemy entities, and Gems.

The object of the game is to have the Player move to capture each Gem, which is located somewhere along the stone path.  Along the way to capturing the Gem, the Player must avoid the many Enemies along the path, who will devour the Player if they come in contact with the Player.

The Player is allowed three lives in order to collect all five Gems.  If the Player loses its three lives before collecting all five Gems, the Player loses the game.  However, if the Player captures all five Gems before losing its three lives, the Player wins.

The Player is moved using the up, down, left, and right buttons on the keyboard.  The Player moves from one square to another using these directional buttons.  The Player either loses a life or captures a Gem by coming in “contact” with the Enemy or Gem entities.  This is calculated using a variable representing a number of pixels that represents sufficient proximity between the entities as to constitute a collision between these two entities.

The Frogger game I created uses the typically annoying background music found in many online games.  Mercifully, I provide a “Stop Music!” button to turn the music off. 

  
