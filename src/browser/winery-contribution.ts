import { injectable, inject } from "inversify";
import { CommandService, MessageService } from "@theia/core/lib/common";
import {
    OpenerService,
    open,
    FrontendApplicationContribution,
    FrontendApplication,
} from "@theia/core/lib/browser";
import URI from "@theia/core/lib/common/uri";
import { FileService } from "@theia/filesystem/lib/browser/file-service";
import { FrontendApplicationStateService } from "@theia/core/lib/browser/frontend-application-state";
import { FileNavigatorCommands } from "@theia/navigator/lib/browser/navigator-contribution";

@injectable()
export class WineryFrontendContribution
    implements FrontendApplicationContribution {
    constructor(
        @inject(CommandService) private readonly commandService: CommandService,
        @inject(MessageService) private readonly messageService: MessageService,
        @inject(OpenerService) private readonly openerService: OpenerService,
        @inject(FileService) private readonly fileService: FileService,
        @inject(FrontendApplicationStateService)
        protected readonly frontendApplicationStateService: FrontendApplicationStateService
    ) {
        this.frontendApplicationStateService
            .reachedState("ready")
            .then(() => this.onReady());
    }

    async onStart(app: FrontendApplication): Promise<void> {
        // load this module at FrontendApplication startup
    }

    private async onReady() {
        const queryParams = window.parent.location.toString().split("?")[1];
        const cleanedUpQueryParams = queryParams.split("#")[0];
        const params = new URLSearchParams(cleanedUpQueryParams);
        const path = params.get("path");
        if (path) {
            const uri = new URI(path);
            const stat = await this.fileService.resolve(uri);
            if (stat.children) {
                const files = stat.children?.filter((stat) => stat.isFile);
                if (files.length > 0) {
                    const toscaFile = files.filter((file) =>
                        file.resource.toString().endsWith(".tosca")
                    )[0];
                    if (toscaFile) {
                        open(this.openerService, toscaFile.resource);
                        this.commandService.executeCommand(
                            FileNavigatorCommands.OPEN.id
                        );
                    } else {
                        this.messageService.error(
                            "Could not find Tosca file in folder: " + path
                        );
                    }
                }
            }
        } else {
            this.messageService.error("Failed to parse folder path from URL");
        }
    }
}
