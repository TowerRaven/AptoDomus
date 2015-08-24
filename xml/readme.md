# CORS XML Reader
An AptoDomus module, this is server-centric, hence requires PHP. If you do not
want to install AptoDomus on a server and instead use it as a file, documentation
includes how to remove this portion and run file-only.

This is Cross-Origin Resource Sharing enabled, allowing it to be used separately
from the actual module and on a different server. Effectively creating a JSONP
service from other XML feeds.


## Usage
***processor.php*** is the main root file, it relies on the GET method, using the following arguments:
 * **source**: bbc
 * **type**: news, weather
 * **kind**:
    * *news*: uk, intl, us_can
    * *weather*: 3day, observations
 * **args (array)**:
    * *location*: required for weather (based on source)

Please note that the server requires ***user*** and ***group*** write permissions
to the cache directory. Caches refresh every one hour from the last created cache.


### BBC Specific
Weather location argument is the number found in the URL when viewing a summary
page for a town/city on the BBC weather page.



## Removing XML Feeds
This module is only required for XML feeds, if a service provides JSONP support
and CORS than this isn't necessary; but the BBC only appears to provide RSS feeds
(XML based).

TODO