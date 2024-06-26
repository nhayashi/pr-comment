"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
    try {
        // The pull_request exists on payload when a pull_request event is triggered.
        // Sets action status to failed when pull_request does not exist on payload.
        const pr = github.context.payload.pull_request;
        if (!pr) {
            core.setFailed('github.context.payload.pull_request not exist');
            return;
        }
        // Get input parameters.
        const token = core.getInput('repo-token');
        const message = core.getInput('message');
        core.debug(`message: ${message}`);
        // Create a GitHub client.
        const client = github.getOctokit(token);
        // Get owner and repo from context
        const owner = github.context.repo.owner;
        const repo = github.context.repo.repo;
        // Create a comment on PR
        // https://octokit.github.io/rest.js/#octokit-routes-issues-create-comment
        const response = await client.rest.issues.createComment({
            owner,
            repo,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            issue_number: pr.number,
            body: message
        });
        core.debug(`created comment URL: ${response.data.html_url}`);
        core.setOutput('comment-url', response.data.html_url);
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
exports.run = run;
//# sourceMappingURL=main.js.map