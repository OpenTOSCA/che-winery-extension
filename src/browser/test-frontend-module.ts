/**
 * Generated using theia-extension-generator
 */
import { TestCommandContribution, TestMenuContribution } from './test-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";
import { ContainerModule } from "inversify";

export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(CommandContribution).to(TestCommandContribution);
    bind(MenuContribution).to(TestMenuContribution);
});
