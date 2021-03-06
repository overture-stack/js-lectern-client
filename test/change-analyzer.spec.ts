/*
 * Copyright (c) 2020 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import chai from 'chai';
import * as analyzer from '../src/change-analyzer';
import {
  SchemasDictionaryDiffs,
  FieldDiff,
  ChangeAnalysis,
} from '../src/schema-entities';
import _ from 'lodash';
chai.should();
const diffResponse: any = require('./schema-diff.json');
const schemaDiff: SchemasDictionaryDiffs = {};
for (const entry of diffResponse) {
  const fieldName = entry[0] as string;
  if (entry[1]) {
    const fieldDiff: FieldDiff = {
      before: entry[1].left,
      after: entry[1].right,
      diff: entry[1].diff,
    };
    schemaDiff[fieldName] = fieldDiff;
  }
}

const expectedResult: ChangeAnalysis = {
  fields: {
    addedFields: [],
    renamedFields: [],
    deletedFields: ['primary_diagnosis.menopause_status'],
  },
  metaChanges: {
    core: {
      changedToCore: [],
      changedFromCore: [],
    },
  },
  restrictionsChanges: {
    codeList: {
      created: [],
      deleted: [
        {
          field: 'donor.vital_status',
          definition: ['Alive', 'Deceased', 'Not reported', 'Unknown'],
        },
      ],
      updated: [
        {
          field: 'donor.cause_of_death',
          definition: {
            added: ['N/A'],
            deleted: ['Died of cancer', 'Unknown'],
          },
        },
      ],
    },
    regex: {
      updated: [
        {
          field: 'donor.submitter_donor_id',
          definition: '[A-Za-z0-9\\-\\._]{3,64}',
        },
        {
          field: 'primary_diagnosis.cancer_type_code',
          definition: '[A-Z]{1}[0-9]{2}.[0-9]{0,3}[A-Z]{2,3}$',
        },
      ],
      created: [
        {
          field: 'donor.vital_status',
          definition: '[A-Z]{3,100}',
        },
      ],
      deleted: [],
    },
    required: {
      updated: [],
      created: [],
      deleted: [],
    },
    script: {
      updated: [],
      created: [
        {
          field: 'donor.survival_time',
          definition: ' $field / 2 == 0 ',
        },
      ],
      deleted: [],
    },
    range: {
      updated: [
        {
          definition: {
            max: 1,
          },
          field: 'specimen.percent_stromal_cells'
        }
      ],
      created: [
        {
          field: 'donor.survival_time',
          definition: {
            min: 0,
            max: 200000,
          },
        },
      ],
      deleted: [],
    },
  },
  isArrayDesignationChanges: ['primary_diagnosis.presenting_symptoms'],
  valueTypeChanges: ['sample_registration.program_id']
};

describe('change-analyzer', () => {
  it('categorize changes correctly', () => {
    const result = analyzer.analyzeChanges(schemaDiff);
    result.should.deep.eq(expectedResult);
  });
});
