okay.

so how do you want to make this?

components:
thing to hold color data
thing to render data
thing to interpret input (if using music)
behaviors
interface

flow:
ui. select (or detect) render method. select visualization behavior. select options (speed or music source, color options?)
web: have ui be a menu that can be hidden when not in use. rest of window taken up by canvas.
led controller: not sure.

should probably do web first, translation to led will be tricky for multiple reasons (shape of lights, connections, etc)

main app holds option data (and other basics, like on/off if applicable), acts as hub for components:
  state: image data
  input: affects behavior (either parses music, or has a set pattern)
  behavior: uses input and current state data in run method, changes state
  renderer: it render

how to render?
each behavior should have a render method.
then why do we need a renderer???
we... don't?
are we going to have a render queue?
not necessarily. which means that if there is a queue, it would be handled at the behavior level, surely.
do behaviors vary based of type of display? of course they do. is there any way to abstract that, so one behavior will work differently across multiple displays? I don't think that makes sense.

how are the behaviors going to work?
- they should take in a number of input streams (and not care how many?)
- they should convert that to a visualization
- does that mean we would ever need previous state? or will we just store that in input? ...probably the latter.
- okay, so no state and no renderer. this may be... easy?
- it will likely not be easy.
- perhaps there could be a behavior for each input stream? (and divide inputs into streams?)
- there would then be a standard render loop in the main class.
- is input the right word? maybe data... or datastream
- so have a Data class, and have DataSources... no, just an abstract class. then DataMusic and DataPattern.
- both contain streams... and behaviors? or is behavior consistent? I think it probably should be.
- future goal: put user input into the mix. would be a departure, but would also be cool.