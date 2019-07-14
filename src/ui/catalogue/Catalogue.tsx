import React, { ReactNode, Fragment } from "react";
import Draggable from "react-draggable";
import './catalogue.css';

type CatalogueIndex = {
    id: number;
    name: string;
    iconId: number;
    color: string;
    children: CatalogueIndex[];
};

type CataloguePage = {
    id: number;
    layout: string;
    headlineImage: string;
    teaserImage: string;
    textHeader: string;
    textDetails: string;
};

type CatalogueProps = {};

type CatalogueState = {
    pages: CatalogueIndex[];
    currentPage?: CataloguePage;
    currentTabId: number;
    currentPageId: number;
    currentItemId: number;
    visible: boolean;
};

const dummyPage: CataloguePage = {
    id: 80,
    layout: "default",
    headlineImage: "catalog_wired_header2_es",
    teaserImage: "ctlg_pic_wired_triggers",
    textHeader: "Los Causantes permiten definir qué se necesita que pase para que tenga lugar un Efecto. Para programar un Causante, colócalo en una Sala, haz doble clic en él y ponlo en marcha. Necesitarás apilar un Efecto sobre un Causante.",
    textDetails: "¡Haz click en cada objeto para ver cómo funciona!",
};

const dummyPages: CatalogueIndex[] = [
    {
        id: 0,
        name: "Catálogo",
        iconId: 1,
        color: "c8684e",
        children: [],
    },
    {
        id: 1,
        name: "Wired",
        iconId: 80,
        color: "aaaaaa",
        children: [
            {
                id: 81,
                name: "Causantes",
                iconId: 81,
                color: "",
                children: [],
            },
            {
                id: 82,
                name: "Efectos",
                iconId: 82,
                color: "",
                children: [],
            },
            {
                id: 83,
                name: "Condiciones",
                iconId: 83,
                color: "",
                children: [],
            }
        ],
    },
    {
        id: 2,
        name: "Tienda",
        iconId: 2,
        color: "8ebb4a",
        children: [],
    }
];

const initialState = {
    pages: dummyPages,
    currentPage: dummyPage,
    currentPageId: -1,
    currentTabId: -1,
    currentItemId: -1,
    visible: true,
};

export default class Catalogue extends React.Component<CatalogueProps, CatalogueState> {
    constructor(props: CatalogueProps) {
        super(props);
        this.state = initialState;
    }

    generateTabs(): ReactNode {
        const { pages, currentPageId, currentTabId } = this.state;

        return pages.map(currentPage => {
            const children = currentPage.children.map(child => {
                return (
                    <button onClick={this.handleChangePage(child.id)} key={child.id} className={"second_tab" + (currentPageId === child.id ? ' selected' : '')}>
                        <div className="icon">
                            <img src={"http://images.bobba.io/c_images/catalogue/icon_" + child.iconId + ".png"} alt={child.name} />
                        </div>
                        <span>{child.name}</span>
                    </button>
                );
            });

            return (
                <Fragment key={currentPage.id}>
                    <button onClick={this.handleChangePage(currentPage.id)} className={"main_tab" + (currentPageId === currentPage.id ? ' selected' : '') + (currentTabId === currentPage.id ? ' open' : '')}>
                        <div className="icon" style={{ backgroundColor: '#' + currentPage.color }}>
                            <img src={"http://images.bobba.io/c_images/catalogue/icon_" + currentPage.iconId + ".png"} alt={currentPage.name} />
                        </div>
                        <span>{currentPage.name}</span>
                    </button>
                    {currentTabId === currentPage.id ? children : <></>}
                </Fragment>
            );
        });
    }

    handleChangePage = (id: number) => () => {
        const { pages, currentTabId } = this.state;
        const isMain = pages.some(value => value.id === id);
        if (isMain) {
            if (currentTabId === id) {
                this.setState({
                    currentPageId: id,
                    currentTabId: -1,
                });
            } else {
                this.setState({
                    currentPageId: id,
                    currentTabId: id,
                });
            }
        } else {
            this.setState({
                currentPageId: id,
            });
        }
    }

    generateDescription(): ReactNode {
        const { currentItemId, currentPage } = this.state;
        if (currentPage == null) {
            return <></>;
        }
        if (currentItemId === -1) {
            return (
                <>
                    <div className="image_container">
                        <img src={"http://images.bobba.io/c_images/catalogue/" + currentPage.teaserImage + ".gif"} alt="Furniture" />
                    </div>
                    <div className="description_container">
                        {currentPage.textDetails}
                    </div>
                </>
            );
        }

        return (
            <>
                <div className="image_container">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABWCAYAAAD413leAAAK60lEQVR4Xu2dPYhdRRTHZ6OIiH1Q1l4SFIMJJiSFSLCIGLCwioVgoxithFUsJEUwESs/sBLSpIoY2OAWEkTEYCSRiBKx30VJKYiIGJ/8591zc955M/ec+bjv3fd2p9ns3q+Z+d3/OTNnztysuOGXEaviyvCrO/saDr1TRmeef8j3ym9bm+6D79oOGnq9Z0py6J3hIQLgg6s7MGNvxuAhvn5osupMjdrbPvS2afU3Hx96Q0eAyMFdHL1jatxzK6f4eUNvp6lNC6tEVJyDu/rjNVODDz52oD2PAV1KmENtlB+REjwruBhdArqsMIcIcbR245hJbaknLSvMoUH0AH/49if3+JFH1Z+pEOn8ZYM5JIijox+uenjo5I8/+tS9evKl6E+YWIK93WEOCiJ8IOBZCyD3AHNIfWLqiqFUeJQKkLeuJsxm8DOUflksiOQLTbWOnFQCk0wzTPmigZznG3cnsL1nTOXoK6slDNtrU2HygRSuFYECuu88+6qzX2ZdsRZcaBpx9sRGrzBjo148FMcuv7blnx+KCg05AjQriB6edf4HmLVUiedyZeJ3OX2R8ELBhSFHgPqGmASP24zaIAmmHP0CYGpkaGjzzL4gmuHBjIXK5U+2qqox+IwGYG5Ybygwa0M0wYuB4x3989Utd+tGvcGOnJLAx0GBuQD5/eYNsxbEavCoc2IQ4c9ganfvc+6Rg/mjWZhR8tFywJM7RJ4XzFKI1eGhAwEQJaREmNm188eKQAIgQnyhsF4PESA0pbSfe5li9AKPA+yCiJErYOaqkQYzsRBf6jwz1sOzUmbqGzITeNQpISXWMKdkSjXfvCgwrRBnCq8LIveZIZ+oQbYClAOhIZtZDaKHB/9Bk+SQ6dDe6NA15Pe6jH3O6FTzmTkQqY49KVNjoI6zum7gVxZ4IR+Ct51KKkALPIsSYy2j+WXMZ9KgRu2ZjhNqwqwRbI9B9Au0sqDyKIBJoStrZ6TAK4HYhzmNtbEGzBqrJiGIQYDSR1gXb3PglUDUfGYNJYZe7hKfWQpSQlQBUgPwxp97fyM44S4BxzsoxydqlqEPiDV8JgNJtzP7ymyIeBL5Ha3jUo/fOh++ImTiU+/dJ0QJM7VuBFIkTKswiyCSGlMrGzqfg4tlefM1vVygMYiaL01tI1/usl6LQSItStMeFMsmoiKINdRI8CxZ3qE1vVSYMYja1MQKQo4dUgPsXI2BTURBVRZBLFGihJfTWHQYqdMKswtiaTgvBDpFkTRdIzXSZiLAfPPCJm5fH2KOEkvhyY6S8UkN5qzMaaoiQ3k+qRB9ZObfa87dfeBOhEYzISlKrA0vF6Y2sMHIumSJK9ZnfF7NgyU4nwPkgyNYGYC0KHEEeP/sf9tff9/K6TbMpkG0KFGDRyZENszy7NA5mjI1iNpzSwZA9NK/+Eb3VgXUgZtUE0RSIX4CphVklxI1ePQGYkCBQolRfcL0C83n7ZYmBLR0AKTtMZFmGGrESNXiE70aqaSAlHNFCzx6DlboL94cp0jg31jsrV24MuEvS5WoxWa1+vMgiQQqr+XTDQtEXD8BEn/Q/KNUIgAi5QEdZxlt+uH03vGOXoKpdULucRq67z7hitRYYk6p7ta4s4eI/vmlbbU6Ok2GyH1iKkArjFo+k+4DJZaCRN1LBkBdIcspc7r3VOtqmvzYKZBT80RuVjU1ciX2AdFnZRf6TL5URknC8gXSpiXWFy7lPIsayf/SfVmW+gS3IoikRMidMsfIB1nMqdboEp/JlUfPyQnnxcBrdefHQy9JlxrpxZVjhF4gUkVIhVTxWiBzfKaEVxLOA8C/RuOpV0nBaB+FwwwpMQaPK5FG2Dx6E1TiXV85d/up8aXa4MY/uFGizN+sBdPSgTF4qRYhkKHmQf7nvrZUY+qc+1euTP2NdkTTUl4XPJk5YYbIn9oFkSuRKhZK16CMgNQOtfRaLXjyWRwmxgl/7z9sqY679/oV/+JTCe7+2rfhXLOdD+eFplahfmzzccdLda0Aqyuxq6U1YfYFT9b/7L4NH46kEoJpAWd6A5oQXOhcvtDezMXTIYaG1FKJ1oqWwLTCqzU1kRBlG0l11m17oT7Sks26AE5Isrm5nyvCJ/qDa24c8rnpl0H8fEXCJJ+YM0xPhRnaCBoy0TWmJtTZMYi58DRgEjIHiMB8aK4YNacE8eQR51YfGH/hUMJEIBfOuTQeaYFJAC0RoZKpiWZOc+ClgkMdQnlK0oxSXTshcpD4dwhmiRJlh8VgpgDEPXOmJjFXQEqcJzzULaZC1Zy2pNfG/4IqQzAptpdjUkOdR/mcOJYKMAZD/t3qMwERJcXn1VIe1bkLoIQ4FTuVDae3UcLc+n3T7bp955OWNWDyxFxKvbcG1jWQFp85S3ix7D6tHc3xFW5O+be2o9fzdDoJE18IRqEMrVKYtBRTO6TX5TMJnrb/hHdQjvJ4OC83KtREgiYgxsA9yw6sUyodh8VzQfD3mjD5jl7yd/hZEjjgPpNPtAHQsv+E+qME3p8jW/AgBGWXe9Iv3NOEX01MbW5CINfxO+V9EDBSXh8w+S4mvohay7RSJwGgZf9JLkBSHqkuN4yH5zehvOhkXzPDEzC/ee8Z99nFLyY+70yQ8ZPnTeaYWZ5OEQoYW6YmWoNwPAaQX0tbwy1LSPw6CQ/HSgDWgEj1m4DpnDsuOqtVbCpMCibwOKH23bcSmBaA1DY85+UXTpmy4fqAR/UoVaJ8sbm/DL30WTA5yJRAQg7MVIhIl4h9KyA0WClVXahTa0OUyoxZLzPMkBJTR7lWmCkAqWFahh8fafYBsKY5jcGqokzkwFBJUaKslAYzFyJ9RyfUCagvQN5z/bR5+crit/k5fSmxFzNLN01VohVmLkTEi7sKQMpcJet6pAXorCBWMbNfNv831K8itcHS0NA5PJyH47kQY0qk9H/4Rgkxt87yOrwMs4ZYDWYfIFMhduWcUooF4sh9AURnzhNiFZg1w3mUdZ7yXdV2EfzGtK4wYkUhU8rzlGqpcCgQBwMz9SuOXIUWf7gdIM4N5sQc1PgpTitAqUT8TlmDtdQ4BHMaa0uVqYl1FNv1FUdZwZQ9mCGItUEOGeLMlDmRdGRQYooKYxBrglwEiL3CnIoGKRBTVdgFsRbIRYJYHaYE6DvcoMTUb/Xw0WnId8R8JGUYWnyoBGldT6zll3PvU8Vn8nCeBWJtJWqNtwAMTTMWBWJVZbaduUf/UHxtJcZAWgHS9U2+k+e3aBCrwGzDeQrEVCXCPFPEhsyjpr4cX/n9u8498dZ4s9MiQ6wC84M/6igR8BCxyYVoBcn9Jge5qEqUL3iWz+zanoAHaEqcgOecO7N3/JULvhXCokR5jjStXNU4BoCHP2+vOr4sEIuUqe01obgoPSQED8eaL1z400pBdo1sGzNKKTGXlg1iVZi01yQBHnXsek2IXJkS4DL4RM1aFZtZPjr1Pq8xm0J5MlEMh6uA5Du2m8a2CqTGL6sSq/pMuhl8ngGeB5hrUqU/ZLuO+YtyiTdwu0AsMrN0MfN5IeXRaV6BuYVvFRfKo1tOANwO5jTWlzEzu873mlBGOy1GP+ycQ4ZBIM+WP8ersKDEXpApeNvNnFphBveaAB7K04fazUJdSizgF7w0Cm8H4mR/TWS0Y9MQlXMXNj08FPY97qnBRXO+NpCyAlbB8RttN5+odaK21yQGT97XCjMJVqzyOxDDPRPba1Kl07U3KfX4DsTuHiOYg4RHVf8fv8NoGhbvj6YAAAAASUVORK5CYII=" alt="Causantes" />
                </div>
                <div className="description_container">
                    Los efectos tienen lugar cuando cambia el estado de un Furni mediante un doble clic.
                </div>
                <div className="button_container">
                    <span>3 créditos</span>
                    <button>Comprar</button>
                </div>
            </>
        );
    }

    generateGrid(): ReactNode {
        return (
            <>
                <button onClick={() => { }} className={''}>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAACl0lEQVRIS7WWQWsTQRTHZ2OUIEJV6EGtORRB8FJaGwweihR61S8gItrSg0jBox/AL1Ck1IpI6BfQqyAiqJWUKiiCFw9tUWgPkkPBQ9LI/2X/0zezM5utxLlsdndmfv/3z3tvNjGDH910yyRv69yXBTURJNNv1yrmefMPfv43sADnuxOOvuVkg/cDB2eAnZcVB/70xvuBRhwF/tjcdMBvVhOz/3ErN/Ii/7EDXKnvmjsPz8umPhDPAOV73KfRZxzIA0cjfPZoy1y76eSUaX3/ZYYunhEw341Wq9YJX0AIXMhSAggkAc9L9T0z1mmJEIyAgIRgK19nKZMmZmko6k/NswLWY+rCcSsAe72+vy211mXt+dAQMGQpnmFMLo7JFXmAERNgwboeQ1H6djKJEDHeEci1R65LA8kIYOQOePbF1WCm4j/TgzBYOl77KVC/jjlfC0D0GfD04ogkAKz1QW9fbVvu1MyIhemIdPk4KtMbCID9zAkbcXnhtKjxaxDrUDoYEADw3NqwjdC3NCSAecIqYHOxWV260msKGFCmS0ALCG2uBcSaC528tb8rh4hkdefrZceho3d3rAD80CLgQMxa31ImIa4AYtybaJvacjsMpgoI0F1I26bhfI4MR9JhjY4Q+6VHpWnOl+PgD9Xe0Vb/ctIce3BCEopdiFEA7Nc5wTpCAtX5LM1KrG6/OxVKRnkGsC4Fgv2uFYsw9kGQC15qtMzC53O2A7EO2Y9ZCX0iDAaVBX/7bScurZeiYE5i0gQsjbp4YPWKMeZSarcCzz6pmEZpWDag3Ye1NEZ3Tidk3Phk284tzx0sY53/a4S+AP88dk/33mx7gumy6PcVmevzIRZ34cbjjXKhT9d+UEZTZB7mFPpQL7rZX4R9hCBJOQXEAAAAAElFTkSuQmCC" alt={"Loading"} />
                </button>
                <button onClick={() => { }} className={'selected'}>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAdCAYAAACuc5z4AAAC7UlEQVRIS62VT0hUURTGv2kMjMChGRBTBpowElGxJgiMMF0oim2icCeubCiKSSIiiIigWkRJkaibQpAQRRdJoYHaoihqSErEUhyjnCJQUBBdJC++M97Hncd904Sdhc67577f+fedGQ/Sm/UXv8fN7+oAYH15FMTvA3U4GO1BQ0Ex+nveYWqiRVjzHb2o71jmRyPDDWw9i/gEMPIZ6Eqso/5QGYYWphDxZKHlXqOA90QaUVzeZYSbwBazyvrwXMDMuOtCL8405djPhNIKD+eI3wTXwdJPll9++xcGmwMI1jUIgEEIUP/VmQrsBhbgzWvNuHL9sYDbu1dQsx9Sqg52Bpl9uyJ+U6+ZsXX8SAmevpqUS8O38hHK84IvsVQaK6jYth3tl3alnNPHe25g+m1ZcWgnx9YF2F+VbcOVrPSAmYBteLTKh8mfGyjJ84oaaBOXcxX3nzMWsOqzkhpbwX4zkLLWSq/92a2/PE9RhQLTQbjqcVwDb3xdtcGZLoid8dVzJ3DjwYDAuSBtY8tgi6gUmjpLSd2xgc4FkSF23m/F+MhrPBl643g3+Ui/btpdm2cEX4yewtpSUqM7/EnJ+X07sbS8in17g/K8uLiEQMCPmblvcvdh97CKJUwjmK0g8OVoDJXV4ZTsCCP0Y2waVTUVGOh7IXe4XEzoTlufcE1gWRqWy2yYqdPGR2M4Vh3Gp9g0CgqDCgYuWn5uNjoH3xszFjCjq/J1MMueiScErGd5tqlWb4c7mNKjqdLZXwYieM3rtSshnKZJ1dhjlZxITw3r+8y8wDg4KqA0XGQPl7LcnBUV5aoKu+rao6UWAcxyIf5Dhknw6fN3JTueOZSQGVjvMxVQFi6SoCzdUXYKMEVzxi0ALA6kILRb3KrHTlm5vGv+Idy8LGC1IAqgLUO6H+K0YLJkiNSr3++z5bfZ262BuYWz8cT/B7MdBBeG8kUF2iJsKWNpB/84Nist1PQl5DZkGWQmvc1Ebs4gRr26ZfIH8Cx6KzXkTL0AAAAASUVORK5CYII=" alt={"Loading"} />
                </button>
                <button onClick={() => { }} className={''}>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAeCAYAAADzXER0AAACUElEQVRIS4VVv2sUURD+FkWLa+7qpPA4LyaChZDG7tDs2V6z2AiGwClEURDW/AUWcojgj06CARF0QbGxuIt1mlgcFhc5bhtjfVgEJJg8+WZv1vf2h06zb+fN930zszOsh3IzBVee7XNeZhcCCnbzV9FyyieX2QijoOkecPDD1a7MAbVFYEbi2WABEkQjkMH6VB+f81cSghx4/3MCViAD4w9KaFBb8uRu+3oGzJCV1wkfFQkkGYNp0xH9BvMrXh7c6/UQhqEEkoT1sQyqqI8EtaUC5cFggLtvfRz+BCbR32bZpIurKFb+dfwb588u4PTlGKOXAEGb30KsnUsyagRAdcErVz5z9AlX1z8ijmMwk9tbPl7cGMD3fSmlNG1VfrcRY/kWwPeLN0+mygTvb5c0jMHf+6GjzB48vfZ/ZXbIkODZ4ydSoyrb4DJlAdsDWQbee5VEFc62TtnOhhF1zYQ185tPJhM0Gg13PPv9vjAOh0O8P34gZxKoKTgIAkRRlFfWwEuP3KQ4oqyXKevQlC6GXbtu0tfnCZgZttttN22mld1hJeGSKDirLLvMRk1HSY1cvSxQtymrLGAyK4gkelZVBeeUdfRUrUi5Mufhy0OTa5jJgjV1VSWQe8zFIIEOiRmPx2g2m+Lgvtp24U5SDlMmUI0E7IphDbROp5MjIYjfl8o2MFXmgR3kZNHW799D5cQpOWs5Wi99mqkzJFkSOxPeHRwd4s3mlpB2u93ceNIv3bAzqVaracqtVistreh3o4EpCR31ej0F6Tb+C+yQzF6c+D9J03IVp0yqFQAAAABJRU5ErkJggg==" alt={"Loading"} />
                </button>
                <button onClick={() => { }} className={''}>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAVCAYAAAC6wOViAAAB7UlEQVRIS62UTyhEURTGzyws1GwkxWpKzYIsJ5GmZkrNBmWjJoqdYqWslGRjpSxE2SEa2ShsptSMJpFGUWIxUbOiJEvK4um7887tvjvz5r778hbvz33nnt855zv3RCjc5bjbImG2h9nkHB7sCdbk1DQzrfxYGbsE57qUF6/Hm8uUGJu3hoeCrq3MCGh6OCuer9V3q8xDQbmmOrxwkaNYPG3MPBQUMNW5beYMtelGYcugZnC/zAF1Fib6bRuCgwwEZzkGkxm8RgQU3YhmKJ9umeB1sKXVXeHTL3NUAn47enrJta1BVU24E7VzKBzPjico3tVKlbdv2jkpi7XRoT7xPLt69IVzUByghH48P4lNiAhHAfBqpSDW2Hh9LkmXD180korRebFK0WiUcvkbdUA0LDv8wP/G8a2wlZoCxhcMVDiv8wTKZgaMMA4U0wtQ/paaShoRoanUAHgI+GgeuOxugjJTvEhdEVEjsArvjnUSjgNsWWdD2dW8auWFVovbJc8Pbi695PzNQHyjue5efsUvTWOPT4/40AhXKtFOxfKnZ7MOV6EI1gamQkV5cQO8pe2H9o/u6yIEnBtMBSuGgUeqbqiOQ8+404eA2o0Na9hksVl0jno0WIIgmpmCMJVElv0/YLqmpuAANwVo8iH//wFM5AYjo1pE/AAAAABJRU5ErkJggg==" alt={"Loading"} />
                </button>
                <button onClick={() => { }} className={''}>
                    <img src="images/avatar_editor/avatar_editor_download_icon.png" alt={"Loading"} />
                </button>
            </>
        );
    }

    generatePage(): ReactNode {
        const { currentPage } = this.state;
        if (currentPage != null) {
            return (
                <div className="wrapper">
                    <div className="header_container">
                        <img alt="Furniture" src={"http://images.bobba.io/c_images/catalogue/" + currentPage.headlineImage + ".gif"} />
                    </div>
                    <div className="description">
                        {currentPage.textHeader}
                    </div>
                    <div className="second_row">
                        <div className="grid_container">
                            <div className="title">
                                Elige un furni
                        </div>
                            <div className="grid">
                                {this.generateGrid()}
                            </div>
                        </div>
                        <div className="item_description">
                            {this.generateDescription()}
                        </div>
                    </div>
                </div>
            );
        }
        return <></>;
    }
    render() {
        return (
            <Draggable>
                <div className="catalogue">
                    <div className="content">
                        {this.generatePage()}
                    </div>
                    <div className="navigator">
                        <button className="close">
                            X
                        </button>
                        <h2>Shop</h2>
                        <hr />
                        <div className="tab_container">
                            {this.generateTabs()}
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
}