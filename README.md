# Appender

a small webserver that allows users to read a directory of .txt files, and append characters to any of them, at any time, or create new files in completely arbitrary directories.

I'm not sure why you would want to do this, but give it a try and see what people make with it, okay?

Comes with rate limiting for user appendings. Defaults to 10 appends every 10 minutes, and a maximum append length of 255 characters.

Also comes with a containerized version to run with Docker or Kubernetes, if you really want high performance.

Please message me if you use this for anything interesting.
