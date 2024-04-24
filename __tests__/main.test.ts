/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'
import * as github from '@actions/github'
import nock from 'nock'
import * as process from 'process'

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    github.context.payload = {
      action: 'opened',
      pull_request: {
        number: 1
      }
    }
  })

  it('comments on PR', async () => {
    process.env['INPUT_REPO-TOKEN'] = 'test-github-token'
    process.env['INPUT_MESSAGE'] = 'Test Comment'
    process.env['GITHUB_REPOSITORY'] = 'testowner/testrepo'

    nock('https://api.github.com')
      .post(
        '/repos/testowner/testrepo/issues/1/comments',
        body => body.body === 'Test Comment'
      )
      .reply(200, {
        html_url:
          'https://github.com/testowner/testrepo/issues/1#issuecomment-1'
      })
    const setOutputMock = jest.spyOn(core, 'setOutput')

    await main.run()

    expect(setOutputMock).toHaveBeenCalledWith(
      'comment-url',
      'https://github.com/testowner/testrepo/issues/1#issuecomment-1'
    )
  })
})
