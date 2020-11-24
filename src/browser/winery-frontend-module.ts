import { WineryFrontendContribution } from "./winery-contribution";
import { ContainerModule } from "inversify";
import { FrontendApplicationContribution } from "@theia/core/lib/browser";

export default new ContainerModule((bind) => {
    bind(WineryFrontendContribution).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toDynamicValue((c) =>
        c.container.get(WineryFrontendContribution)
    );
});
