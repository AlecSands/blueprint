/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

import { H5, MenuItem, Switch } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";
import { Suggest2 } from "@blueprintjs/select";

import {
    areFilmsEqual,
    createFilm,
    filterFilm,
    IFilm,
    maybeAddCreatedFilmToArrays,
    maybeDeleteCreatedFilmFromArrays,
    renderCreateFilmOption,
    renderFilm,
    TOP_100_FILMS,
} from "./../../common/films";

const FilmSuggest = Suggest2.ofType<IFilm>();

export interface ISuggestExampleState {
    allowCreate: boolean;
    closeOnSelect: boolean;
    createdItems: IFilm[];
    disabled: boolean;
    fill: boolean;
    film: IFilm;
    items: IFilm[];
    matchTargetWidth: boolean;
    minimal: boolean;
    openOnKeyDown: boolean;
    resetOnClose: boolean;
    resetOnQuery: boolean;
    resetOnSelect: boolean;
}

export class SuggestExample extends React.PureComponent<ExampleProps, ISuggestExampleState> {
    public state: ISuggestExampleState = {
        allowCreate: false,
        closeOnSelect: true,
        createdItems: [],
        disabled: false,
        fill: false,
        film: TOP_100_FILMS[0],
        items: [...TOP_100_FILMS],
        matchTargetWidth: false,
        minimal: true,
        openOnKeyDown: false,
        resetOnClose: false,
        resetOnQuery: true,
        resetOnSelect: false,
    };

    private handleAllowCreateChange = this.handleSwitchChange("allowCreate");

    private handleCloseOnSelectChange = this.handleSwitchChange("closeOnSelect");

    private handleDisabledChange = this.handleSwitchChange("disabled");

    private handleFillChange = this.handleSwitchChange("fill");

    private handleMatchTargetWidthChange = this.handleSwitchChange("matchTargetWidth");

    private handleMinimalChange = this.handleSwitchChange("minimal");

    private handleOpenOnKeyDownChange = this.handleSwitchChange("openOnKeyDown");

    private handleResetOnCloseChange = this.handleSwitchChange("resetOnClose");

    private handleResetOnQueryChange = this.handleSwitchChange("resetOnQuery");

    private handleResetOnSelectChange = this.handleSwitchChange("resetOnSelect");

    public render() {
        const { allowCreate, film, matchTargetWidth, minimal, ...flags } = this.state;

        const maybeCreateNewItemFromQuery = allowCreate ? createFilm : undefined;
        const maybeCreateNewItemRenderer = allowCreate ? renderCreateFilmOption : null;

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <FilmSuggest
                    {...flags}
                    createNewItemFromQuery={maybeCreateNewItemFromQuery}
                    createNewItemRenderer={maybeCreateNewItemRenderer}
                    inputValueRenderer={this.renderInputValue}
                    items={this.state.items}
                    itemsEqual={areFilmsEqual}
                    itemPredicate={filterFilm}
                    itemRenderer={renderFilm}
                    noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
                    onItemSelect={this.handleValueChange}
                    popoverProps={{ matchTargetWidth, minimal }}
                />
            </Example>
        );
    }

    protected renderOptions() {
        return (
            <>
                <H5>Props</H5>
                <Switch
                    label="Close on select"
                    checked={this.state.closeOnSelect}
                    onChange={this.handleCloseOnSelectChange}
                />
                <Switch
                    label="Open popover on key down"
                    checked={this.state.openOnKeyDown}
                    onChange={this.handleOpenOnKeyDownChange}
                />
                <Switch
                    label="Reset on close"
                    checked={this.state.resetOnClose}
                    onChange={this.handleResetOnCloseChange}
                />
                <Switch
                    label="Reset on query"
                    checked={this.state.resetOnQuery}
                    onChange={this.handleResetOnQueryChange}
                />
                <Switch
                    label="Reset on select"
                    checked={this.state.resetOnSelect}
                    onChange={this.handleResetOnSelectChange}
                />
                <Switch
                    label="Allow creating new items"
                    checked={this.state.allowCreate}
                    onChange={this.handleAllowCreateChange}
                />
                <H5>Appearance props</H5>
                <Switch label="Disabled" checked={this.state.disabled} onChange={this.handleDisabledChange} />
                <Switch label="Fill container width" checked={this.state.fill} onChange={this.handleFillChange} />
                <H5>Popover props</H5>
                <Switch
                    label="Match target width"
                    checked={this.state.matchTargetWidth}
                    onChange={this.handleMatchTargetWidthChange}
                />
                <Switch
                    label="Minimal popover style"
                    checked={this.state.minimal}
                    onChange={this.handleMinimalChange}
                />
            </>
        );
    }

    private renderInputValue = (film: IFilm) => film.title;

    private handleValueChange = (film: IFilm) => {
        // delete the old film from the list if it was newly created
        const { createdItems, items } = maybeDeleteCreatedFilmFromArrays(
            this.state.items,
            this.state.createdItems,
            this.state.film,
        );
        // add the new film to the list if it is newly created
        const { createdItems: nextCreatedItems, items: nextItems } = maybeAddCreatedFilmToArrays(
            items,
            createdItems,
            film,
        );
        this.setState({ createdItems: nextCreatedItems, film, items: nextItems });
    };

    private handleSwitchChange(prop: keyof ISuggestExampleState) {
        return (event: React.FormEvent<HTMLInputElement>) => {
            const checked = event.currentTarget.checked;
            this.setState(state => ({ ...state, [prop]: checked }));
        };
    }
}
