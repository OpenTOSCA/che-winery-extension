/**
 * Generated using theia-extension-generator
 */
import { WineryCommandContribution, WineryMenuContribution } from './winery-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";
import { ContainerModule } from "inversify";

export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(CommandContribution).to(WineryCommandContribution);
    bind(MenuContribution).to(WineryMenuContribution);
});
