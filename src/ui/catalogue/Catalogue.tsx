import React, { ReactNode } from "react";
import Draggable from "react-draggable";
import './catalogue.css';

type CatalogueProps = {};
type CatalogueState = {};
const initialState = {};
export default class Catalogue extends React.Component<CatalogueProps, CatalogueState> {
    constructor(props: CatalogueProps) {
        super(props);
        this.state = initialState;
    }

    generateTabs(): ReactNode {
        return (
            <>
                <button className="main_tab">
                    <div className="icon" style={{ backgroundColor: '#c8684e' }}>
                        <img src="http://images.bobba.io/c_images/catalogue/icon_1.png" alt="Front page" />
                    </div>
                    <span>Front Page</span>
                </button>
                <button className="main_tab open">
                    <div className="icon" style={{ backgroundColor: '#aaaaaa' }}>
                        <img src="http://images.bobba.io/c_images/catalogue/icon_80.png" alt="Front page" />
                    </div>
                    <span>Wired</span>
                </button>
                <button className="second_tab">
                    <div className="icon">
                        <img src="http://images.bobba.io/c_images/catalogue/icon_81.png" alt="Front page" />
                    </div>
                    <span>Causantes</span>
                </button>
                <button className="second_tab selected">
                    <div className="icon">
                        <img src="http://images.bobba.io/c_images/catalogue/icon_82.png" alt="Front page" />
                    </div>
                    <span>Efectos</span>
                </button>
                <button className="second_tab">
                    <div className="icon">
                        <img src="http://images.bobba.io/c_images/catalogue/icon_83.png" alt="Front page" />
                    </div>
                    <span>Condiciones</span>
                </button>
                <button className="main_tab">
                    <div className="icon" style={{ backgroundColor: '#8ebb4a' }}>
                        <img src="http://images.bobba.io/c_images/catalogue/icon_2.png" alt="Front page" />
                    </div>
                    <span>Tienda</span>
                </button>
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
        return (
            <div className="wrapper">
                <div className="header_container">
                    <img alt="Causantes" src="http://images.bobba.io/c_images/catalogue/catalog_wired_header2_es.gif" />
                </div>
                <div className="description">
                    Los Causantes permiten definir qué se necesita que pase para que tenga lugar un Efecto. Para programar un Causante, colócalo en una Sala, haz doble clic en él y ponlo en marcha. Necesitarás apilar un Efecto sobre un Causante.
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

                    </div>
                </div>
            </div>
        );
    }
    render() {
        return (
            <Draggable>
                <div className="catalogue">
                    <div className="content">
                        {this.generatePage()}
                    </div>
                    <div className="navigator">
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