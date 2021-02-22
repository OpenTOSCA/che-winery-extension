
# che-winery-extension

The *che-winery-extension* is a [frontend extension](https://theia-ide.org/docs/authoring_extensions/) for the [https://theia-ide.org/](Theia Editor) running in a [Eclipse Che](https://www.eclipse.org/che/) environment. It enables the [TOSCA](https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=tosca) modeling tool [Winery](https://github.com/OpenTOSCA/winery) to open TOSCA definition files in Theia.

## How to use?

> The following steps assume you already have a Eclipse Che running with the *che-winery-extension* installed in Theia

To open a TOSCA file in Theia call the following url:

```
http://theiaUrl:theiaPort?path=folder/containing/a/tosca/definition
```

## How does the extension work?


The extension implements the so called `FrontendApplicationContribution` ([What are contributions?](https://theia-ide.org/docs/services_and_contributions/)) this allows the extension to run when the application is loaded. On loading it checks if the `path` query-parameter is set. Then the it is checked if the path is a folder and if it contains a file with a `.tosca` extension. If the check is positive the file is opened else a error is shown.

