[![Experimental Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Experimental.png)](https://opensource.newrelic.com/oss-category/#experimental)

# NGO Validation Service [build badges go here when available]

The NGO Validation Service is responsible for check the eligibility of NGO by using TechSoup API.

## Installation

### Requirements

- Serverless framework
- NodeJS in version 12 minimum

## Getting Started

Before installation set environmental variables in `.env` file. This file contains the REGION and STAGE variables. If those variable will be empty the default values will be provided:

- STAGE=<stage_of_lambda_deployment>
- REGION=<region_where_to_deploy_lambda>
- LOOKUP_API_URL=<url_to_lookup_api>
- CONSTRAINT_API_URL=<url_to_constraint_api>
- CONSTRAINT_ID=<your_constraint_id>
- SESSION_KEY=<your_session_key>

If you have serverless framework installed, type `npm install` and `sls offline` in your terminal in the project folder.

## Usage

The lambda can be used in two way - offline and from your AWS account. The offline method is for testing purposes only and can be run with command `sls offline`. To deploy lambda function to the AWS, first you need to add to the `.aws/credentials` your client credential from your AWS. The section in the credentials could looks like:

> [profile name]
> aws_access_key_id = <your_key>
> aws_secret_access_key = <your_secret_key>
> region = <your_region>

After that you can deploy the lambda to your AWS space by using command `sls deploy --aws-profile <your_profile_name>`

## Testing

To run all tests type `npm test` in your terminal in project folder.

## Defined Error Codes

During the verification process the Lambda sends request to the Lookup API then to Constraint API. For each of those APIs there are defined responses (might be error response or valid response).

1. Lookup API

|              Message              | Internal Error Code | Status Code |
| :-------------------------------: | :-----------------: | :---------: |
|         No token provided         |        40001        |     400     |
|        Bad token provided         |        40002        |     400     |
| Verified - TechSoup Token expired |        40101        |     401     |
|    Sorry you do not qualified     |        40102        |     401     |
|   This endpoint does not exist    |        40401        |     404     |
|    No data for provided token     |        40402        |     404     |

2. Constraint API
   This API codes has been defined but there are not handled. The translation of error code to meaningful must be implemented by yourself. The table below presents the codes which are defined in code which you can use. In the API some of the codes were not described.

|  Code  |  Group  |                    Text                    |                                                             Description                                                             |
| :----: | :-----: | :----------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------: |
| E00_1  | System  |           Unknow client program            |                                   The program code being used is not a valid code forthis client                                    |
| E00_2  | Entity  |  Offer not available for this entity type  |                            The entity type: “organization” is not valid for this program for this client                            |
| E00_3  | Entity  |            Entity not qualified            |                        The validation process is complete and the status for this entity is “Not Qualified”                         |
| E00_4  | Entity  |        Entity pending qualification        |                      Registration has been completed and the organization is in the process of being validated                      |
| E00_5  | Program |              Timestamp error               |                    Time since previous qualification exceeds acceptable period for this program for this client                     |
| E00_6  | Program |   Offer not available for this location    |               The primary location for this organization is outside acceptable bands for this program for this client               |
| E00_7  | Program | Offer not available for this activity code | The activity code(s) (primary and/or secondary) for this organization are outside acceptable bands for this program for this client |
| E00_8  | Program |    Offer not available for this budget     |                                   The program code being used is not a valid code forthis client                                    |
| E00_9  |         |                                            |                                                                                                                                     |
| E00_10 |         |                                            |                                                                                                                                     |
| E00_11 | System  |           Organization not found           |                                   The organization can not be found using provided data point(s)                                    |
| E00_12 | System  |              Agent not found               |                    The agent trying to act on behalf of the organization is not associated with the organization                    |
| E00_13 |         |                                            |                                                                                                                                     |
| E00_14 |         |                                            |                                                                                                                                     |
| E00_15 |         |                                            |                                                                                                                                     |

## Additional information

If you want to validate if the organisation is matching in your system/flow you need to implement this method by yourself. The definition of this method you'll find in `src/utils/org-validator.ts`.

## Support

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

> Add the url for the support thread here

## License

This project is distributed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.

## Contributing

We encourage your contributions to improve [project name]! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.
If you have any questions, or to execute our corporate CLA, required if your contribution is on behalf of a company, please drop us an email at opensource@newrelic.com.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="http://joelworrall.com"><img src="https://avatars0.githubusercontent.com/u/929261?v=4" width="100px;" alt="Joel Worrall"/><br /><sub><b>Joel Worrall</b></sub></a><br /><a href="https://github.com/newrelic/nr-ngo-validation-serverless/commits?author=tangollama" title="Code">💻</a> <a href="#ideas-tangollama" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/norbertsuski"><img src="https://avatars2.githubusercontent.com/u/5214156?v=4" width="100px;" alt="Norbert Suski"/><br /><sub><b>Norbert Suski</b></sub></a><br /><a href="#ideas-nsus" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/newrelic/nr-ngo-validation-serverless/commits?author=norbertsuski" title="Code">💻</a>
    <td align="center"><a href="https://github.com/DominikMarciniszyn"><img src="https://avatars3.githubusercontent.com/u/59443662?v=4" width="100px;" alt="Dominik Marciniszyn"/><br /><sub><b>Dominik Marciniszyn</b></sub></a><br /><a href="#ideas-dmar" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/newrelic/nr-ngo-validation-serverless/commits?author=DominikMarciniszyn" title="Code">💻</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
