/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Boom from '@hapi/boom';

import { IndexMapping } from '../../../mappings';
import { getQueryParams } from './query_params';
import { getSortingParams } from './sorting_params';
import { ISavedObjectTypeRegistry } from '../../../saved_objects_type_registry';
import { SavedObjectsFindOptions } from '../../../types';

type KueryNode = any;

interface GetSearchDslOptions {
  type: string | string[];
  search?: string;
  defaultSearchOperator?: string;
  searchFields?: string[];
  rootSearchFields?: string[];
  sortField?: string;
  sortOrder?: string;
  namespaces?: string[];
  typeToNamespacesMap?: Map<string, string[] | undefined>;
  hasReference?: {
    type: string;
    id: string;
  };
  kueryNode?: KueryNode;
  workspaces?: SavedObjectsFindOptions['workspaces'];
  workspacesSearchOperator?: 'AND' | 'OR';
  ACLSearchParams?: SavedObjectsFindOptions['ACLSearchParams'];
}

export function getSearchDsl(
  mappings: IndexMapping,
  registry: ISavedObjectTypeRegistry,
  options: GetSearchDslOptions
) {
  const {
    type,
    search,
    defaultSearchOperator,
    searchFields,
    rootSearchFields,
    sortField,
    sortOrder,
    namespaces,
    typeToNamespacesMap,
    hasReference,
    kueryNode,
    workspaces,
    workspacesSearchOperator,
    ACLSearchParams,
  } = options;

  if (!type) {
    throw Boom.notAcceptable('type must be specified');
  }

  if (sortOrder && !sortField) {
    throw Boom.notAcceptable('sortOrder requires a sortField');
  }

  return {
    ...getQueryParams({
      registry,
      namespaces,
      type,
      typeToNamespacesMap,
      search,
      searchFields,
      rootSearchFields,
      defaultSearchOperator,
      hasReference,
      kueryNode,
      workspaces,
      workspacesSearchOperator,
      ACLSearchParams,
    }),
    ...getSortingParams(mappings, type, sortField, sortOrder),
  };
}
