# Promise Framework

Promises is a way to chain groupped synchronous and asynchronous javascript methods. 

As you chain events together, their results are added to a common object and they are available all the way to the end of the chaining. 
This is helpful in the case a later even needs something from the first event and allows you to refer to the value without storing it on the outside but also because you can group promises together and their results are merged together and used in the next then.

Please see the index.html for a sample
